import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# Load the extended sales data from the CSV file generated by fakeData.py
all_sales_data = pd.read_csv('all_sales_data.csv')

# Convert sale_date to datetime
all_sales_data['sale_date'] = pd.to_datetime(all_sales_data['sale_date'])

# Ensure there are no NaN values in the quantity_sold column
all_sales_data = all_sales_data.dropna(subset=['quantity_sold'])

# Print the initial sales data
print("Extended Sales Data:")
print(all_sales_data.head())

# Check if there are enough data points
if all_sales_data.shape[0] < 2:
    raise ValueError("The all_sales_data DataFrame has less than 2 rows, not enough data for forecasting.")

# Aggregate sales data by date to get total quantity sold per day
daily_sales = all_sales_data.groupby('sale_date').sum().reset_index()

# Rename columns to fit Prophet's expected format
daily_sales = daily_sales.rename(columns={'sale_date': 'ds', 'quantity_sold': 'y'})

# Print the aggregated data
print("Aggregated Daily Sales Data for Prophet:")
print(daily_sales.head())
print(f"Total rows in daily_sales: {daily_sales.shape[0]}")

# Check if the DataFrame is empty or has less than 2 rows
if daily_sales.shape[0] < 2:
    raise ValueError("The daily_sales DataFrame has less than 2 rows after preprocessing. Check your data.")

# Initialize and fit the Prophet model
model = Prophet()
model.fit(daily_sales)

# Make future dataframe for the next 30 days
future = model.make_future_dataframe(periods=30)

# Predict future sales
forecast = model.predict(future)

# Print the forecasted data
print("Forecast Data:")
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].head())

# Plot the forecast
model.plot(forecast)
plt.title('Forecast of Sales for the Next 30 Days')
plt.xlabel('Date')
plt.ylabel('Quantity Sold')
plt.show()