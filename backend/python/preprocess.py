import pandas as pd
from sklearn.model_selection import train_test_split
from db import engine
from ingredientReqs import forecasted_ingredients_summary
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTEENN

# Load forecasted ingredients summary
print("Forecasted Ingredients Summary:")
print(forecasted_ingredients_summary.head())

# Ensure 'date' column in forecasted_ingredients_summary is datetime
forecasted_ingredients_summary['date'] = pd.to_datetime(forecasted_ingredients_summary['date'])

# Load historical ingredient usage data
historical_usage_data = pd.read_sql("SELECT * FROM supplies_ordered", engine)

# Ensure 'order_date' column in historical_usage_data is datetime
historical_usage_data['order_date'] = pd.to_datetime(historical_usage_data['order_date'])

# Merge forecasted data with historical usage data to form a complete dataset
merged_data = pd.merge(forecasted_ingredients_summary, historical_usage_data, 
                       left_on=['date', 'ingredient_id'], right_on=['order_date', 'ingredient_id'], how='left')

# Focus on date, ingredient_id, quantity_needed (forecasted), quantity_ordered, and quantity_used (historical)
merged_data = merged_data[['date', 'ingredient_id', 'quantity_needed', 'quantity_ordered', 'quantity_used']]
merged_data = merged_data.fillna(0)  # Fill NaNs with 0, or use an appropriate strategy

# Print to verify the merged data
print("Merged Dataset:")
print(merged_data.head())

# Features for training: quantity_needed, historical usage data
# Target: quantity_ordered (this is what we want to optimize)
features = merged_data[['quantity_needed', 'quantity_used']]
targets = merged_data['quantity_ordered']

# Print the distribution of the target variable to understand the imbalance
print("Distribution of 'quantity_ordered':")
print(targets.value_counts())

# Check the minimum number of samples in any class
min_samples = targets.value_counts().min()
print(f"Minimum samples in any class: {min_samples}")

# Set n_neighbors for SMOTE
# Ensure n_neighbors is at least 1
n_neighbors = max(1, min(min_samples - 1, 5))  # Choose a safe n_neighbors value
print(f"Using n_neighbors={n_neighbors} for SMOTE.")

# Option 1: Oversampling using SMOTE with adjusted n_neighbors
try:
    smote = SMOTE(random_state=42, k_neighbors=n_neighbors)
    X_resampled, y_resampled = smote.fit_resample(features, targets)
    print("SMOTE applied successfully.")
except ValueError as e:
    print(f"SMOTE failed: {e}")
    # Fallback to RandomUnderSampler or SMOTEENN if SMOTE fails
    undersampler = RandomUnderSampler(random_state=42)
    X_resampled, y_resampled = undersampler.fit_resample(features, targets)
    print("Fallback to RandomUnderSampler.")

# Option 2: Undersampling using RandomUnderSampler (alternative approach)
# undersampler = RandomUnderSampler(random_state=42)
# X_resampled, y_resampled = undersampler.fit_resample(features, targets)

# Option 3: Combine Oversampling and Undersampling using SMOTEENN (alternative approach)
# smote_enn = SMOTEENN(random_state=42)
# X_resampled, y_resampled = smote_enn.fit_resample(features, targets)

# Print to verify the resampled data
print("Resampled Features Shape:", X_resampled.shape)
print("Resampled Targets Shape:", y_resampled.shape)
print("Distribution of Resampled 'quantity_ordered':")
print(pd.Series(y_resampled).value_counts())

# Split the resampled data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Print to verify the training data after resampling
print("Training Features After Resampling:")
print(X_train.head())
print("Training Targets After Resampling:")
print(y_train.head())
