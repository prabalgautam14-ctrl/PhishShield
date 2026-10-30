import pandas as pd

print("Loading UCI dataset...")

data = pd.read_csv("phishing_dataset.csv")

print("Original shape:", data.shape)

# UCI result:
# -1 = legitimate
#  1 = phishing

# Select URL-related features that can be represented
# directly from URL information.
features = [
    "having_ip_address",
    "url_length",
    "shortining_service",
    "having_at_symbol",
    "double_slash_redirecting",
    "prefix_suffix",
    "having_sub_domain",
    "https_token",
    "port",
    "submitting_to_email",
    "redirect",
    "abnormal_url",
    "statistical_report",
    "result"
]

available = [column for column in features if column in data.columns]

data = data[available]

print("\nSelected columns:")
print(data.columns.tolist())

print("\nDataset shape:")
print(data.shape)

print("\nLabel distribution:")
print(data["result"].value_counts())

data.to_csv(
    "url_features_dataset.csv",
    index=False
)

print("\nSaved as url_features_dataset.csv")