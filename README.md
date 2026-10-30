# 🛡️ PhishShield

### AI-Powered URL Security & Phishing Detection

PhishShield is a security-focused URL shortener that uses Machine Learning to analyze URLs for potential phishing threats before allowing them to be shortened and shared.

The project combines **URL shortening, phishing detection, security analysis, QR code generation, and click tracking** into a single web application.

---

## 🚀 Features

- 🔍 **ML-Based Phishing Detection**
- 🛡️ **URL Security Analysis**
- 📊 **Phishing & Legitimate Probability**
- ⚠️ **Security Warnings & Positive Signals**
- 🔗 **Custom Short URLs**
- ⏳ **URL Expiration**
- 📱 **QR Code Generation**
- 📈 **Click Tracking & Analytics**
- 🌙 **Dark / Light Mode**
- 📱 **Responsive UI**

---

## 🧠 Machine Learning

PhishShield uses a Machine Learning model to classify URLs as potentially **phishing** or **legitimate**.

The current model uses 8 URL-based features:

1. Having IP Address
2. URL Length
3. URL Shortening Service
4. `@` Symbol
5. Double Slash Redirecting
6. Prefix/Suffix
7. Subdomains
8. SSL Final State

The model generates:

- Phishing probability
- Legitimate probability
- Prediction result
- Security warnings
- Positive security signals

> The probabilities are model predictions based on the extracted URL features and should not be treated as a guarantee that a URL is safe or malicious.

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS

### Backend

- Next.js API Routes
- MongoDB

### Machine Learning

- Python
- Flask
- Scikit-learn
- Pandas
- Joblib

---

## 📂 Project Structure

```text
PhishShield/
│
├── app/
│   ├── about/
│   ├── contact/
│   ├── dashboard/
│   ├── shorten/
│   └── [shorturl]/
│
├── components/
│   ├── Navbar.js
│   └── ThemeToggle.js
│
├── ml-phishing-detector/
│   ├── api.py
│   ├── app.py
│   ├── train.py
│   ├── predict.py
│   ├── dataset.csv
│   └── phishing_model.pkl
│
├── public/
├── package.json
├── README.md
└── .gitignore