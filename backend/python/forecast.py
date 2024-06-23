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

if __name__ == '__main__':
    app.run(debug=True)