import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('all_sales_data.csv')

# Print the initial state of the DataFrame to verify loading
print("Initial DataFrame:")
print(df.head())
print(df.info())

# Find the maximum existing sale_id to start generating new IDs from there
max_sale_id = df['sale_id'].max(skipna=True)

# If max_sale_id is NaN, set it to 0 to start the IDs from 1
if pd.isna(max_sale_id):
    max_sale_id = 0

# Generate new sale_id values for rows with missing sale_id
next_sale_id = max_sale_id + 1
for index, row in df.iterrows():
    if pd.isna(row['sale_id']):
        df.at[index, 'sale_id'] = next_sale_id
        print(f"Updated sale_id for row {index} to {next_sale_id}")
        next_sale_id += 1

# Convert the sale_id column to integers (if it makes sense for your data)
df['sale_id'] = df['sale_id'].astype(int)

# Print the updated DataFrame to verify changes
print("Updated DataFrame:")
print(df.head())
print(df.tail())

# Save the updated DataFrame to a new CSV file
df.to_csv('path_to_updated_csv_file.csv', index=False)
