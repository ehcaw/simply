import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from preprocess import X_train, X_test, y_train, y_test
import pandas as pd
from ingredientReqs import forecasted_ingredients_summary


# Define the neural network model
model = Sequential([
    Dense(64, input_dim=X_train.shape[1], activation='relu'),  # Input layer and first hidden layer
    Dense(32, activation='relu'),  # Second hidden layer
    Dense(16, activation='relu'),  # Third hidden layer
    Dense(1)  # Output layer for regression
])

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Print the model summary
model.summary()

# Train the model
history = model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2)

# Print training history
print("Training history:")
print(history.history)

# Evaluate the model on the test set
loss = model.evaluate(X_test, y_test)
print(f'Test Loss: {loss}')

# Predict ingredient orders on the test set
predictions = model.predict(X_test)

# Print the predictions and compare with actual values
comparison = pd.DataFrame({'Predicted': predictions.flatten(), 'Actual': y_test})
print("Predictions vs Actual:")
print(comparison.head())

# Predict future ingredient orders using the forecasted data
future_features = forecasted_ingredients_summary[['quantity_needed', 'quantity_needed']]  # Using quantity_needed for both columns for simplicity
future_predictions = model.predict(future_features)

# Add predictions to the forecasted ingredient requirements
forecasted_ingredients_summary['predicted_quantity_ordered'] = future_predictions

# Print the final forecast with predicted orders
print("Forecasted Ingredient Requirements with Predicted Orders:")
print(forecasted_ingredients_summary.head())

# Save the forecast with predictions to a CSV for future use
forecasted_ingredients_summary.to_csv('forecasted_ingredient_orders.csv', index=False)

