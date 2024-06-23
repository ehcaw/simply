from flask import Flask, request, jsonify
from sqlalchemy import text
from datetime import datetime, timedelta
from db import engine

# Initialize Flask app
app = Flask(__name__)

@app.route('/forecast_week', methods=['GET'])
def forecast_week():
    # Get the date parameter from the request
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'No date provided'}), 400

    try:
        start_date = datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    # Calculate the end date (7 days after the start date)
    end_date = start_date + timedelta(days=7)

    # Query to fetch predicted ingredients data from the database for the given week
    query = text("""
        SELECT ingredient_id, ingredient_name, SUM(predicted_quantity_needed) AS total_predicted_quantity
        FROM predicted_ingredients
        WHERE date >= :start_date AND date < :end_date
        GROUP BY ingredient_id, ingredient_name
    """)

    # Execute the query
    with engine.connect() as connection:
        results = connection.execute(
            query, 
            {'start_date': start_date.strftime('%Y-%m-%d'), 'end_date': end_date.strftime('%Y-%m-%d')}
        ).fetchall()

    # Convert results to a dictionary format using integer indices
    forecast_results = [
        {'ingredient_id': row[0], 'ingredient_name': row[1], 'total_predicted_quantity': row[2]}
        for row in results
    ]

    return jsonify(forecast_results)    

@app.route('/sales_summary', methods=['GET'])
def sales_summary():
    # Get the month parameter from the request
    month_str = request.args.get('month')

    # Validate the month parameter
    if not month_str:
        return jsonify({'error': 'Please provide a month parameter'}), 400

    try:
        month = int(month_str)
        # Validate month range
        if not (1 <= month <= 12):
            return jsonify({'error': 'Month must be between 1 and 12'}), 400
    except ValueError:
        return jsonify({'error': 'Month must be an integer'}), 400

    # Use the current year
    current_year = datetime.now().year

    # Determine the first and last day of the given month in the current year
    try:
        start_date = datetime(current_year, month, 1)
        # The end_date should be the first day of the next month
        if month == 12:
            end_date = datetime(current_year + 1, 1, 1)
        else:
            end_date = datetime(current_year, month + 1, 1)
    except ValueError:
        return jsonify({'error': 'Invalid month'}), 400

    # SQL query to fetch total quantity of drinks sold in the given month
    query = text("""
        SELECT 
            d.drink_name, SUM(s.quantity_sold) AS total_quantity_sold
        FROM 
            all_sales s
        JOIN
            drinks d ON s.drink_id = d.drink_id
        WHERE 
            s.sale_date >= :start_date AND s.sale_date < :end_date
        GROUP BY 
            d.drink_name
    """)

    # Execute the query
    with engine.connect() as connection:
        results = connection.execute(
            query, 
            {'start_date': start_date.strftime('%Y-%m-%d'), 'end_date': end_date.strftime('%Y-%m-%d')}
        ).fetchall()

    # Convert results to a dictionary format using integer indices
    sales_summary_results = [
        {'drink_name': row[0], 'total_quantity_sold': row[1]}
        for row in results
    ]

    return jsonify(sales_summary_results)


if __name__ == '__main__':
    app.run(debug=True)