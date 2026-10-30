
from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import os
import re
import ipaddress

from urllib.parse import urlparse, unquote


# ==========================================
# 1. FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# 2. LOAD ML MODEL
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "phishing_model.pkl"
)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "phishing_model.pkl not found. Run train.py first."
    )

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
feature_names = model_data["features"]

print("\n================================")
print("PHISHSHIELD ML MODEL LOADED")
print("================================")

print("Features:")

for feature in feature_names:
    print("-", feature)

print("================================\n")


# ==========================================
# 3. URL VALIDATION AND NORMALIZATION
# ==========================================

def normalize_url(url):

    url = str(url).strip()

    if not url:
        raise ValueError("URL cannot be empty")

    if any(ord(char) < 32 for char in url):
        raise ValueError("URL contains invalid characters")

    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "https://" + url

    parsed = urlparse(url)

    if parsed.scheme not in ["http", "https"]:
        raise ValueError("Unsupported URL protocol")

    if not parsed.hostname:
        raise ValueError("Invalid URL: hostname missing")

    try:
        hostname = parsed.hostname.encode("idna").decode("ascii")
    except UnicodeError:
        raise ValueError("Invalid domain name")

    try:
        port = parsed.port
    except ValueError:
        raise ValueError("Invalid port number")

    if parsed.username or parsed.password:
        pass

    return url, parsed, hostname.lower()


# ==========================================
# 4. FEATURE EXTRACTION
# ==========================================

def extract_features(url):

    url, parsed, hostname = normalize_url(url)

    lower_url = url.lower()

    features = {}

    # --------------------------------------
    # 1. IP ADDRESS
    # --------------------------------------

    try:
        ipaddress.ip_address(hostname)

        features["having_ip_address"] = 1

    except ValueError:

        features["having_ip_address"] = -1


    # --------------------------------------
    # 2. URL LENGTH
    # --------------------------------------

    length = len(url)

    if length < 54:
        features["url_length"] = -1

    elif length <= 75:
        features["url_length"] = 0

    else:
        features["url_length"] = 1


    # --------------------------------------
    # 3. URL SHORTENING SERVICE
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
        1 if any(
            service == hostname or hostname.endswith("." + service)
            for service in shortening_services
        ) else -1
    )


    # --------------------------------------
    # 4. @ SYMBOL
    # --------------------------------------

    features["having_at_symbol"] = (
        1 if "@" in url else -1
    )


    # --------------------------------------
    # 5. DOUBLE SLASH REDIRECTING
    # --------------------------------------

    after_protocol = re.sub(
        r"^https?://",
        "",
        lower_url,
        count=1
    )

    features["double_slash_redirecting"] = (
        1 if "//" in after_protocol else -1
    )


    # --------------------------------------
    # 6. PREFIX / SUFFIX
    # --------------------------------------

    features["prefix_suffix"] = (
        1 if "-" in hostname else -1
    )


    # --------------------------------------
    # 7. SUBDOMAIN
    # --------------------------------------

    dot_count = hostname.count(".")

    if dot_count <= 1:
        features["having_sub_domain"] = -1

    elif dot_count == 2:
        features["having_sub_domain"] = 0

    else:
        features["having_sub_domain"] = 1


    # --------------------------------------
    # 8. SSL FINAL STATE
    # --------------------------------------

    features["sslfinal_state"] = (
        1 if parsed.scheme == "https" else -1
    )


    # --------------------------------------
    # MATCH TRAINING FEATURE ORDER
    # --------------------------------------

    feature_vector = [
        features.get(feature, 0)
        for feature in feature_names
    ]

    return feature_vector, features


# ==========================================
# 5. SECURITY ANALYSIS
# ==========================================

def security_analysis(url):

    positive_signals = []
    warnings = []

    url, parsed, hostname = normalize_url(url)

    lower_url = url.lower()

    # --------------------------------------
    # HTTPS CHECK
    # --------------------------------------

    if parsed.scheme == "https":

        positive_signals.append(
            "Uses HTTPS"
        )

    else:

        warnings.append(
            "Does not use HTTPS"
        )


    # --------------------------------------
    # IP ADDRESS CHECK
    # --------------------------------------

    try:

        ipaddress.ip_address(hostname)

        warnings.append(
            "IP address used instead of a domain"
        )

    except ValueError:

        positive_signals.append(
            "Uses a domain name"
        )


    # --------------------------------------
    # URL LENGTH
    # --------------------------------------

    if len(url) > 100:

        warnings.append(
            "Excessive URL length"
        )

    else:

        positive_signals.append(
            "URL length appears normal"
        )


    # --------------------------------------
    # @ SYMBOL
    # --------------------------------------

    if "@" in url:

        warnings.append(
            "URL contains @ character"
        )

    else:

        positive_signals.append(
            "No @ symbol detected"
        )


    # --------------------------------------
    # SHORTENING SERVICE
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

    if any(
        hostname == service or hostname.endswith("." + service)
        for service in shortening_services
    ):

        warnings.append(
            "URL shortening service detected"
        )

    else:

        positive_signals.append(
            "No common URL shortening service detected"
        )


    # --------------------------------------
    # HYPHEN
    # --------------------------------------

    if "-" in hostname:

        warnings.append(
            "Hyphen detected in domain name"
        )

    else:

        positive_signals.append(
            "No domain hyphen detected"
        )


    # --------------------------------------
    # SUBDOMAIN
    # --------------------------------------

    if hostname.count(".") >= 3:

        warnings.append(
            "Unusually complex domain structure"
        )

    else:

        positive_signals.append(
            "Domain structure appears normal"
        )


    # --------------------------------------
    # SUSPICIOUS URL CHARACTERS
    # --------------------------------------

    if re.search(r"%40|%2f%2f", lower_url):

        warnings.append(
            "Encoded characters may hide URL redirection"
        )


    # --------------------------------------
    # QUERY PARAMETERS
    # --------------------------------------

    if len(parsed.query) > 100:

        warnings.append(
            "Unusually long URL query parameters"
        )


    return positive_signals, warnings


# ==========================================
# 6. FEATURE IMPORTANCE DEBUGGING
# ==========================================

def print_debug(url, feature_vector):

    print("\n========== PHISHSHIELD DEBUG ==========")

    print("URL:", url)

    print("\nExtracted Features:")

    for name, value in zip(feature_names, feature_vector):

        print(f"{name}: {value}")


    if hasattr(model, "feature_importances_"):

        print("\nModel Feature Importance:")

        importance = sorted(
            zip(
                feature_names,
                model.feature_importances_
            ),
            key=lambda item: item[1],
            reverse=True
        )

        for name, score in importance:

            print(f"{name}: {score:.4f}")


    print("=======================================\n")


# ==========================================
# 7. PREDICT API
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json(silent=True)

        if not data or not isinstance(data, dict):

            return jsonify({
                "error": "Valid JSON body is required"
            }), 400


        url_input = data.get("url")

        if not isinstance(url_input, str) or not url_input.strip():

            return jsonify({
                "error": "Valid URL is required"
            }), 400


        # ----------------------------------
        # NORMALIZE URL
        # ----------------------------------

        url, parsed, hostname = normalize_url(url_input)


        # ----------------------------------
        # EXTRACT FEATURES
        # ----------------------------------

        feature_vector, extracted_features = extract_features(url)


        # ----------------------------------
        # DEBUG INFORMATION
        # ----------------------------------

        print_debug(url, feature_vector)


        # ----------------------------------
        # ML PREDICTION
        # ----------------------------------

        prediction = model.predict(
            [feature_vector]
        )[0]


        probabilities = model.predict_proba(
            [feature_vector]
        )[0]


        classes = list(model.classes_)

        phishing_probability = 0.0
        legitimate_probability = 0.0


        for cls, probability in zip(classes, probabilities):

            if cls == -1:

                phishing_probability = float(probability * 100)

            elif cls == 1:

                legitimate_probability = float(probability * 100)


        # ----------------------------------
        # CLASSIFICATION
        # ----------------------------------

        if prediction == -1:

            result = "phishing"

            confidence = phishing_probability

        elif prediction == 1:

            result = "legitimate"

            confidence = legitimate_probability

        else:

            raise ValueError(
                f"Unexpected model prediction: {prediction}"
            )


        # ----------------------------------
        # SECURITY ANALYSIS
        # ----------------------------------

        positive_signals, warnings = security_analysis(url)


        if result == "phishing":

            warnings.append(
                "ML model detected characteristics associated with phishing URLs"
            )


        # ----------------------------------
        # RISK LEVEL
        # ----------------------------------

        if phishing_probability >= 70:

            risk_level = "High"

        elif phishing_probability >= 40:

            risk_level = "Medium"

        else:

            risk_level = "Low"


        # ----------------------------------
        # API RESPONSE
        # ----------------------------------

        return jsonify({

            "url": url,

            "result": result,

            "risk_level": risk_level,

            "phishing_probability": round(
                phishing_probability
            ),

            "legitimate_probability": round(
                legitimate_probability
            ),

            "confidence": round(
                confidence
            ),

            "security_analysis": {

                "positive_signals": positive_signals,

                "warnings": warnings

            }

        }), 200


    except ValueError as error:

        return jsonify({

            "error": str(error)

        }), 400


    except Exception as error:

        print("PREDICTION ERROR:", error)

        return jsonify({

            "error": "Internal prediction error"

        }), 500


# ==========================================
# 8. HEALTH CHECK
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "status": "running",

        "application": "PhishShield ML API",

        "model_loaded": model is not None,

        "features": feature_names

    })


# ==========================================
# 9. START FLASK SERVER
# ==========================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )
