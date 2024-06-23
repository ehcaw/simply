import pandas as pd
from faker import Faker
import random
from db import sales_data, drinks_data

# Initialize Faker
fake = Faker()

# Generate fake sales data for a period (e.g., 90 days)
def generate_fake_sales_data(start_date, num_days, drinks):
    data = []
    for i in range(num_days):
        date = start_date + pd.Timedelta(days=i)
        for drink_id in drinks:
            quantity_sold = random.randint(5, 20)  # Random sales quantity
            data.append({'sale_date': date, 'drink_id': drink_id, 'quantity_sold': quantity_sold})
    return pd.DataFrame(data)

# Existing sales data start date
start_date = sales_data['sale_date'].min()

# Number of days to generate data for
num_days = 90  # Let's generate data for the next 90 days

# Get the list of drink IDs from the existing drinks data
drink_ids = drinks_data['drink_id'].tolist()

# Generate fake sales data
fake_sales_data = generate_fake_sales_data(start_date, num_days, drink_ids)

# Append the new fake data to the existing sales data
all_sales_data = pd.concat([sales_data, fake_sales_data], ignore_index=True)

# Save the extended sales data to a CSV file
all_sales_data.to_csv('all_sales_data.csv', index=False)