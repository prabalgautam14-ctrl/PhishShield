import os
import joblib
import pandas as pd
import ipaddress
from urllib.parse import urlparse


# ==========================================
# 1. LOAD TRAINED MODEL
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "phishing_model.pkl")

if not os.path.exists(MODEL_PATH):
    print("❌ phishing_model.pkl not found!")
    print("Please run train.py first.")
    exit()

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
feature_names = model_data["features"]

print("✅ Model loaded successfully!")


# ==========================================
# 2. FEATURE EXTRACTION
# ==========================================

def extract_features(url):

    url = str(url).strip()
    lower_url = url.lower()

    # Add protocol if missing
    test_url = lower_url

    if not test_url.startswith(("http://", "https://")):
        test_url = "http://" + test_url

    parsed = urlparse(test_url)

    hostname = parsed.netloc.split(":")[0]

    features = {}


    # --------------------------------------
    # 1. having_ip_address
    # --------------------------------------

    try:
        ipaddress.ip_address(hostname)
        features["having_ip_address"] = 1
    except ValueError:
        features["having_ip_address"] = -1


    # --------------------------------------
    # 2. url_length
    # --------------------------------------

    url_length = len(lower_url)

    if url_length < 54:
        features["url_length"] = -1
    elif url_length <= 75:
        features["url_length"] = 0
    else:
        features["url_length"] = 1


    # --------------------------------------
    # 3. shortining_service
    # --------------------------------------

    shortening_services = [
        "bit.ly",
        "goo.gl",
        "tinyurl.com",
        "t.co",
        "ow.ly",
        "is.gd",
        "buff.ly",
        "cutt.ly",
        "shorturl.at"
    ]

    features["shortining_service"] = (
        1
        if any(service in lower_url for service in shortening_services)
        else -1
    )


    # --------------------------------------
    # 4. having_at_symbol
    # --------------------------------------

    features["having_at_symbol"] = (
        1 if "@" in lower_url else -1
    )


    # --------------------------------------
    # 5. double_slash_redirecting
    # --------------------------------------

    # Ignore the // in http:// or https://
    after_protocol = lower_url.replace("https://", "")
    after_protocol = after_protocol.replace("http://", "")

    features["double_slash_redirecting"] = (
        1 if "//" in after_protocol else -1
    )


    # --------------------------------------
    # 6. prefix_suffix
    # --------------------------------------

    features["prefix_suffix"] = (
        1 if "-" in hostname else -1
    )


    # --------------------------------------
    # 7. having_sub_domain
    # --------------------------------------

    dot_count = hostname.count(".")

    if dot_count <= 1:
        features["having_sub_domain"] = -1
    elif dot_count == 2:
        features["having_sub_domain"] = 0
    else:
        features["having_sub_domain"] = 1


    # --------------------------------------
    # 8. sslfinal_state
    # --------------------------------------

    features["sslfinal_state"] = (
        1 if parsed.scheme == "https" else -1
    )


    # ======================================
    # Remaining 22 features
    # ======================================

    # These features require webpage/domain
    # analysis. For this first version,
    # safe numerical defaults are used.

    remaining_features = [

        "domain_registration_length",
        "favicon",
        "port",
        "https_token",
        "request_url",
        "url_of_anchor",
        "links_in_tags",
        "sfh",
        "submitting_to_email",
        "abnormal_url",
        "redirect",
        "on_mouseover",
        "rightclick",
        "popupwindow",
        "iframe",
        "age_of_domain",
        "dnsrecord",
        "web_traffic",
        "page_rank",
        "google_index",
        "links_pointing_to_page",
        "statistical_report"
    ]

    for feature in remaining_features:
        features[feature] = 0


    # ======================================
    # Put features in EXACT training order
    # ======================================

    feature_values = []

    for feature in feature_names:
        feature_values.append(
            features.get(feature, 0)
        )

    return feature_values


# ==========================================
# 3. GET URL FROM USER
# ==========================================

print("\n==============================")
print("      AI PHISHING DETECTOR")
print("==============================")

url = input("\nEnter URL to scan: ").strip()


if not url:
    print("❌ Please enter a URL.")
    exit()


# ==========================================
# 4. EXTRACT FEATURES
# ==========================================

features = extract_features(url)

input_data = pd.DataFrame(
    [features],
    columns=feature_names
)


# ==========================================
# 5. MAKE PREDICTION
# ==========================================

prediction = model.predict(input_data)[0]

probabilities = model.predict_proba(input_data)[0]

class_probabilities = dict(
    zip(model.classes_, probabilities)
)


# ==========================================
# 6. GET PROBABILITIES
# ==========================================

phishing_probability = (
    class_probabilities.get(-1, 0) * 100
)

legitimate_probability = (
    class_probabilities.get(1, 0) * 100
)


# ==========================================
# 7. DISPLAY RESULT
# ==========================================

print("\n------------------------------")
print("        AI URL ANALYSIS")
print("------------------------------")

print(f"URL: {url}")

print(
    f"\nPhishing Probability: "
    f"{phishing_probability:.2f}%"
)

print(
    f"Legitimate Probability: "
    f"{legitimate_probability:.2f}%"
)


if prediction == -1:

    print("\n⚠️ RESULT: PHISHING")

else:

    print("\n✅ RESULT: LEGITIMATE")


print("------------------------------")