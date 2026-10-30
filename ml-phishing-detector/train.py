
import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score
)


# ==========================================
# 1. PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "phishing_dataset.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "phishing_model.pkl"
)


# ==========================================
# 2. FEATURES
# ==========================================

selected_features = [
    "having_ip_address",
    "url_length",
    "shortining_service",
    "having_at_symbol",
    "double_slash_redirecting",
    "prefix_suffix",
    "having_sub_domain",
    "sslfinal_state"
]


# ==========================================
# 3. LOAD DATASET
# ==========================================

print("\n================================")
print("PHISHSHIELD MODEL TRAINING")
print("================================")

print("\nLoading dataset...")

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        "phishing_dataset.csv not found!"
    )

data = pd.read_csv(DATASET_PATH)

data.columns = data.columns.str.strip().str.lower()

print("Dataset loaded successfully!")

print("Total rows:", len(data))
print("Total columns:", len(data.columns))


# ==========================================
# 4. VALIDATE DATASET
# ==========================================

if "result" not in data.columns:
    raise ValueError(
        "'result' label column not found."
    )

missing_features = [
    feature for feature in selected_features
    if feature not in data.columns
]

if missing_features:
    raise ValueError(
        f"Missing features: {missing_features}"
    )

print("\nChecking missing values...")

print(
    data[selected_features].isnull().sum()
)


# ==========================================
# 5. PREPARE FEATURES AND LABELS
# ==========================================

X = data[selected_features].copy()

y = pd.to_numeric(
    data["result"],
    errors="coerce"
)

X = X.apply(
    pd.to_numeric,
    errors="coerce"
)

# Remove rows with invalid labels
valid_rows = y.notna()

X = X.loc[valid_rows]
y = y.loc[valid_rows].astype(int)

# Replace missing feature values
X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

X = X.fillna(0)

# Validate expected class labels
if set(y.unique()) != {-1, 1}:
    raise ValueError(
        f"Expected labels -1 and 1, found: {sorted(y.unique())}"
    )

print("\nLabel mapping:")
print("-1 = Phishing")
print(" 1 = Legitimate")

print("\nClass distribution:")

print(
    y.value_counts().sort_index()
)

print("\nFeatures used:")

for feature in selected_features:
    print("-", feature)


# ==========================================
# 6. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# 7. RANDOM FOREST BASE MODEL
# ==========================================

rf = RandomForestClassifier(

    random_state=42,

    class_weight="balanced",

    n_jobs=-1

)


# ==========================================
# 8. HYPERPARAMETER TUNING
# ==========================================

print("\n================================")
print("HYPERPARAMETER TUNING")
print("================================")

param_grid = {

    "n_estimators": [200, 400],

    "max_depth": [None, 20],

    "min_samples_split": [2, 5],

    "min_samples_leaf": [1, 2],

    "max_features": ["sqrt"]

}

cv = StratifiedKFold(

    n_splits=5,

    shuffle=True,

    random_state=42

)

grid_search = GridSearchCV(

    estimator=rf,

    param_grid=param_grid,

    scoring="f1_macro",

    cv=cv,

    n_jobs=-1,

    verbose=1,

    refit=True

)

grid_search.fit(
    X_train,
    y_train
)

best_model = grid_search.best_estimator_

print("\nBest parameters:")

print(
    grid_search.best_params_
)

print("\nBest cross-validation F1:")

print(
    round(grid_search.best_score_ * 100, 2),
    "%"
)


# ==========================================
# 9. TEST SET EVALUATION
# ==========================================

print("\n================================")
print("MODEL EVALUATION")
print("================================")

predictions = best_model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions,
    pos_label=-1,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    pos_label=-1,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    pos_label=-1,
    zero_division=0
)

print("\nAccuracy:", round(accuracy * 100, 2), "%")

print("Phishing Precision:", round(precision * 100, 2), "%")

print("Phishing Recall:", round(recall * 100, 2), "%")

print("Phishing F1 Score:", round(f1 * 100, 2), "%")


# ==========================================
# 10. CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:\n")

print(
    classification_report(

        y_test,

        predictions,

        labels=[-1, 1],

        target_names=[
            "Phishing",
            "Legitimate"
        ],

        zero_division=0

    )
)


# ==========================================
# 11. CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(

    y_test,

    predictions,

    labels=[-1, 1]

)

print("\nConfusion Matrix:")

print(cm)

# Rows: actual classes [-1, 1]
# Columns: predicted classes [-1, 1]

true_phishing_detected = cm[0][0]

false_negatives = cm[0][1]

false_positives = cm[1][0]

true_legitimate_detected = cm[1][1]

print("\nDetection Analysis:")

print(
    "Correctly detected phishing:",
    true_phishing_detected
)

print(
    "Missed phishing URLs:",
    false_negatives
)

print(
    "Legitimate URLs incorrectly flagged:",
    false_positives
)

print(
    "Correctly identified legitimate URLs:",
    true_legitimate_detected
)


# ==========================================
# 12. FEATURE IMPORTANCE
# ==========================================

print("\n================================")
print("FEATURE IMPORTANCE")
print("================================")

importance = sorted(

    zip(
        selected_features,
        best_model.feature_importances_
    ),

    key=lambda item: item[1],

    reverse=True

)

for feature, score in importance:

    print(
        f"{feature}: {score:.4f}"
    )


# ==========================================
# 13. PREDICTION PROBABILITY CHECK
# ==========================================

print("\n================================")
print("PROBABILITY CHECK")
print("================================")

probabilities = best_model.predict_proba(X_test)

classes = list(best_model.classes_)

phishing_index = classes.index(-1)

phishing_probabilities = probabilities[:, phishing_index]

print(
    "Mean phishing probability:",
    round(float(np.mean(phishing_probabilities)) * 100, 2),
    "%"
)

print(
    "Note: These are uncalibrated model probabilities."
)


# ==========================================
# 14. SAVE MODEL
# ==========================================

print("\n================================")
print("SAVING MODEL")
print("================================")

model_data = {

    "model": best_model,

    "features": selected_features,

    "labels": {
        -1: "phishing",
        1: "legitimate"
    },

    "best_params": grid_search.best_params_,

    "training_accuracy": float(accuracy),

    "cross_validation_f1": float(grid_search.best_score_)

}

joblib.dump(
    model_data,
    MODEL_PATH
)

print("\nModel saved successfully!")

print("Location:", MODEL_PATH)

print("\n================================")
print("PHISHSHIELD TRAINING COMPLETED")
print("================================")
