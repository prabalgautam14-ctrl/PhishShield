from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from urllib.parse import urlparse
import ipaddress

app = FastAPI()

model = joblib.load("phishing_model.pkl")


class URLRequest(BaseModel):
    url: str


def extract_features(url):

    url = str(url).strip()

    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)

    hostname = parsed.hostname or ""
    path = parsed.path or ""

    lower_url = url.lower()

    # -----------------------------------
    # 1. having_ip_address
    # -----------------------------------

    try:
        ipaddress.ip_address(hostname)
        having_ip_address = 1
    except ValueError:
        having_ip_address = -1

    # -----------------------------------
    # 2. url_length
    # -----------------------------------

    if len(url) < 54:
        url_length = -1
    elif len(url) <= 75:
        url_length = 0
    else:
        url_length = 1

    # -----------------------------------
    # 3. shortining_service
    # -----------------------------------

    shortening_services = [
        "bit.ly",
        "tinyurl.com",
        "goo.gl",
        "t.co",
        "ow.ly",
        "is.gd",
        "buff.ly",
        "cutt.ly",
        "shorturl.at"
    ]

    shortining_service = (
        1
        if any(x in hostname.lower()
               for x in shortening_services)
        else -1
    )

    # -----------------------------------
    # 4. having_at_symbol
    # -----------------------------------

    having_at_symbol = 1 if "@" in url else -1

    # -----------------------------------
    # 5. double_slash_redirecting
    # -----------------------------------

    double_slash_redirecting = (
        1 if "//" in url[8:] else -1
    )

    # -----------------------------------
    # 6. prefix_suffix
    # -----------------------------------

    prefix_suffix = (
        1 if "-" in hostname else -1
    )

    # -----------------------------------
    # 7. having_sub_domain
    # -----------------------------------

    domain_parts = hostname.split(".")

    if len(domain_parts) <= 2:
        having_sub_domain = -1
    elif len(domain_parts) == 3:
        having_sub_domain = 0
    else:
        having_sub_domain = 1

    # -----------------------------------
    # 8. sslfinal_state
    # -----------------------------------

    sslfinal_state = (
        1 if parsed.scheme == "https" else -1
    )

    # -----------------------------------
    # 9. domain_registration_length
    # -----------------------------------

    # Cannot reliably determine registration
    # length without WHOIS data.
    domain_registration_length = 0

    # -----------------------------------
    # 10. favicon
    # -----------------------------------

    favicon = -1

    # -----------------------------------
    # 11. port
    # -----------------------------------

    try:
        port = parsed.port
        port_feature = (
            1 if port not in (None, 80, 443)
            else -1
        )
    except ValueError:
        port_feature = 1

    # -----------------------------------
    # 12. https_token
    # -----------------------------------

    https_token = (
        1
        if "https" in hostname.lower()
        else -1
    )

    # -----------------------------------
    # 13. request_url
    # -----------------------------------

    request_url = -1

    # -----------------------------------
    # 14. url_of_anchor
    # -----------------------------------

    url_of_anchor = -1

    # -----------------------------------
    # 15. links_in_tags
    # -----------------------------------

    links_in_tags = -1

    # -----------------------------------
    # 16. sfh
    # -----------------------------------

    sfh = -1

    # -----------------------------------
    # 17. submitting_to_email
    # -----------------------------------

    submitting_to_email = (
        1
        if "mailto:" in lower_url
        else -1
    )

    # -----------------------------------
    # 18. abnormal_url
    # -----------------------------------

    abnormal_url = -1

    # -----------------------------------
    # 19. redirect
    # -----------------------------------

    redirect = (
        1
        if url.count("//") > 1
        else -1
    )

    # -----------------------------------
    # 20. on_mouseover
    # -----------------------------------

    on_mouseover = -1

    # -----------------------------------
    # 21. rightclick
    # -----------------------------------

    rightclick = -1

    # -----------------------------------
    # 22. popupwindow
    # -----------------------------------

    popupwindow = -1

    # -----------------------------------
    # 23. iframe
    # -----------------------------------

    iframe = -1

    # -----------------------------------
    # 24. age_of_domain
    # -----------------------------------

    age_of_domain = 0

    # -----------------------------------
    # 25. dnsrecord
    # -----------------------------------

    dnsrecord = 0

    # -----------------------------------
    # 26. web_traffic
    # -----------------------------------

    web_traffic = 0

    # -----------------------------------
    # 27. page_rank
    # -----------------------------------

    page_rank = 0

    # -----------------------------------
    # 28. google_index
    # -----------------------------------

    google_index = 1

    # -----------------------------------
    # 29. links_pointing_to_page
    # -----------------------------------

    links_pointing_to_page = 0

    # -----------------------------------
    # 30. statistical_report
    # -----------------------------------

    statistical_report = -1

    # -----------------------------------
    # IMPORTANT:
    # result is NOT included.
    # It is the prediction target.
    # -----------------------------------

    features = [
        having_ip_address,
        url_length,
        shortining_service,
        having_at_symbol,
        double_slash_redirecting,
        prefix_suffix,
        having_sub_domain,
        sslfinal_state,
        domain_registration_length,
        favicon,
        port_feature,
        https_token,
        request_url,
        url_of_anchor,
        links_in_tags,
        sfh,
        submitting_to_email,
        abnormal_url,
        redirect,
        on_mouseover,
        rightclick,
        popupwindow,
        iframe,
        age_of_domain,
        dnsrecord,
        web_traffic,
        page_rank,
        google_index,
        links_pointing_to_page,
        statistical_report
    ]

    return features


@app.get("/")
def home():

    return {
        "message": "BitLinks ML Phishing Detector is running"
    }


@app.post("/predict")
def predict(request: URLRequest):

    url = request.url.strip()

    features = extract_features(url)

    prediction = model.predict([features])[0]

    probabilities = model.predict_proba([features])[0]

    classes = list(model.classes_)

    phishing_probability = (
        probabilities[classes.index(1)] * 100
    )

    legitimate_probability = (
        probabilities[classes.index(-1)] * 100
    )

    if prediction == 1:
        result = "PHISHING"
    else:
        result = "LEGITIMATE"

    return {
        "url": url,
        "prediction": result,
        "phishingProbability": round(
            phishing_probability, 2
        ),
        "legitimateProbability": round(
            legitimate_probability, 2
        )
    }