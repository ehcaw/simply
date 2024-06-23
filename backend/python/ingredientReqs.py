import pandas as pd
from salesPred import forecast
from db import engine
from utils.convert import convert_quantity_to_float

# Load drink_ingredients_data from your database
drink_ingredients_data = pd.read_sql("SELECT * FROM drink_ingredients", engine)

# Print the drink ingredients data to verify
print(drink_ingredients_data.head())

# Print the forecast data to verify
print(forecast.tail())

# Load historical sales data
sales_data = pd.read_sql("SELECT * FROM sales", engine)

# Calculate historical sales proportions
historical_sales_by_drink = sales_data.groupby('drink_id')['quantity_sold'].sum().reset_index()
total_historical_sales = historical_sales_by_drink['quantity_sold'].sum()

# Calculate the proportion of each drink's sales
historical_sales_by_drink['sales_proportion'] = historical_sales_by_drink['quantity_sold'] / total_historical_sales

# Print the sales proportions for each drink
print("Historical Sales Proportions:")
print(historical_sales_by_drink)


# Map the forecasted sales to ingredient needs
forecasted_ingredients = []

# Iterate over each day in the forecast
for index, row in forecast.iterrows():
    date = row['ds']
    total_forecasted_sales = row['yhat']  # Total forecasted sales for the day
    
    # Distribute the total forecast to each drink based on historical proportions
    for _, drink_row in historical_sales_by_drink.iterrows():
        drink_id = drink_row['drink_id']
        proportion = drink_row['sales_proportion']
        forecasted_sales_for_drink = total_forecasted_sales * proportion  # Forecasted quantity for this drink
        
        # Find the ingredients needed for this drink
        ingredients = drink_ingredients_data[drink_ingredients_data['drink_id'] == drink_id]
        for _, ing_row in ingredients.iterrows():
            ingredient_id = ing_row['ingredient_id']
            # Use the conversion function to get the numerical value of the quantity
            quantity_value = convert_quantity_to_float(ing_row['quantity'])
            quantity_needed = quantity_value * forecasted_sales_for_drink
            forecasted_ingredients.append({
                'date': date,
                'ingredient_id': ingredient_id,
                'quantity_needed': quantity_needed,
                'drink_id': drink_id  # Optional: Track which drink contributes to the need
            })

# Convert to DataFrame
forecasted_ingredients_df = pd.DataFrame(forecasted_ingredients)

# Aggregate by date and ingredient_id
forecasted_ingredients_summary = forecasted_ingredients_df.groupby(['date', 'ingredient_id']).sum().reset_index()

# Print the forecasted ingredient requirements summary
print("Forecasted Ingredient Requirements Summary:")
print(forecasted_ingredients_summary.head())
