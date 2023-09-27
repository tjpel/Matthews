import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


df = pd.read_excel('../final_processed_dataset.xlsx')

# Selected features for the model
selected_features = ['Size', 'Assessed Improved', 'Assessed Value', 'Building SF', 'Number Of Units', 'Number Of Floors', 'Price Per AC Land', 'Price Per SF Land', 'Asking Price', 'Number Of 1 Bedrooms Units', 'Number Of 2 Bedrooms Units', 'Floor Area Ratio', 'Assessed Land', 'Number Of Parking Spaces', 'Number Of Studios Units', 'Typical Floor (SF)', 'Number Of 3 Bedrooms Units', 'Land Area AC', 'Land Area SF', 'Star Rating', 'Net Income', 'Year Built', 'Age', 'Building Class', 'Property Address', 'Net Income']

# Features and target variable
X = df[selected_features]
y = df['Sale Price']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create polynomial and interaction features
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X_poly_train = poly.fit_transform(X_train)
X_poly_test = poly.transform(X_test)

# Initialize high-performing models
rf = RandomForestRegressor(random_state=42)
gb = GradientBoostingRegressor(random_state=42)
high_performing_models = {'Random Forest': rf, 'Gradient Boosting': gb}

# Train models and evaluate their performance
for name, model in high_performing_models.items():
    model.fit(X_poly_train, y_train)
    y_pred = model.predict(X_poly_test)
    print(f"{name} - MAE: {mean_absolute_error(y_test, y_pred)}, MSE: {mean_squared_error(y_test, y_pred)}, R2: {r2_score(y_test, y_pred)}")

    # Save the trained model
    with open(f"{name}_model.pkl", "wb") as f:
        pickle.dump(model, f)

# Create ensemble predictions
ensemble_predictions = np.mean(np.column_stack([model.predict(X_poly_test) for model in high_performing_models.values()]), axis=1)

# Evaluate the ensemble model
print(f"Ensemble - MAE: {mean_absolute_error(y_test, ensemble_predictions)}, MSE: {mean_squared_error(y_test, ensemble_predictions)}, R2: {r2_score(y_test, ensemble_predictions)}")