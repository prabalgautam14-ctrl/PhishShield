import pandas as pd
import os

# Get the folder where this Python file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Input dataset
input_file = os.path.join(BASE_DIR, "dataset.csv")

# Output dataset
output_file = os.path.join(BASE_DIR, "phishing_dataset.csv")

# Check if dataset exists
if not os.path.exists(input_file):
    print("❌ dataset.csv not found!")
    print(f"Expected location: {input_file}")
    exit()

# Load dataset
print("Loading dataset...")

data = pd.read_csv(input_file)

print("✅ Dataset loaded successfully!")
print("Total rows:", len(data))
print("Total columns:", len(data.columns))

print("\nColumns:")
print(data.columns.tolist())

# Display first 5 rows
print("\nFirst 5 rows:")
print(data.head())

# Check missing values
print("\nMissing values:")
print(data.isnull().sum())

# Save processed dataset
data.to_csv(output_file, index=False)

print("\n✅ Saved as phishing_dataset.csv")
print("Total rows:", len(data))
print("File location:", output_file)