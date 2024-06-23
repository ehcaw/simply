import pandas as pd
from datetime import datetime, timedelta
from keras.models import load_model
import numpy as np
from db import engine

# Load the trained model (ensure this points to your actual model file)
model = load_model('ingredient_forecasting_model.h5')

# Define the ingredients and their IDs for reference
ingredients = {
    1: 'Espresso',
    2: 'Steamed Milk',
    3: 'Milk Foam',
    4: 'Hot Water',
    5: 'Chocolate Syrup',
    6: 'Whipped Cream',
    7: 'Cold Water',
    8: 'Ice', 
    9: 'Matcha Powder',
    10: 'Brewed Chai Tea',
    11: 'Honey',
    12: 'Cocoa Powder',
    13: 'Sugar', 
    14: 'Tea Bag',
}

# Use the current date to forecast for the next 150 days (approximately 5 months)
start_date = datetime.now()

# Function to generate realistic 'quantity_needed' and 'quantity_used' values
def generate_realistic_values(day_offset):
    # Example logic: vary quantities based on the day of the week and add randomness
    base_needed = 100
    base_used = 50
    # Adding variation: more sales on weekends, less on weekdays
    weekday = (start_date + timedelta(days=day_offset)).weekday()
    if weekday >= 5:  # If it's Saturday (5) or Sunday (6)
        multiplier = 1.2
    else:
        multiplier = 0.9
    quantity_needed = base_needed * multiplier + np.random.normal(0, 10)  # Adding some random noise
    quantity_used = base_used * multiplier + np.random.normal(0, 5)        # Adding some random noise
    return quantity_needed, quantity_used

# Prepare the DataFrame to store the predictions
predictions = []

# Loop through the next 150 days
for i in range(150):
    current_date = start_date + timedelta(days=i)
    for ingredient_id, ingredient_name in ingredients.items():
        # Generate realistic values
        quantity_needed, quantity_used = generate_realistic_values(i)
        
        # Prepare the input features for prediction
        features = np.array([[quantity_needed, quantity_used]])
        predicted_quantity_ordered = model.predict(features)[0][0]

        # Append the result to the list
        predictions.append({
            'date': current_date.strftime('%Y-%m-%d'),
            'ingredient_id': ingredient_id,
            'ingredient_name': ingredient_name,
            'predicted_quantity_needed': float(predicted_quantity_ordered)/3  # Ensure it's a JSON serializable format
        })

# Convert to DataFrame
predictions_df = pd.DataFrame(predictions)
print(predictions_df)

# Save to database (replace 'predicted_ingredients' with your actual table name)
# Use 'replace' to overwrite the table each time or 'append' to add new records
predictions_df.to_sql('predicted_ingredients', engine, if_exists='replace', index=False)

print("Predictions saved to the database successfully.")
