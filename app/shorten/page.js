"use client";

import { useState } from "react";
import Link from "next/link";

export default function Shorten() {
  const [url, setUrl] = useState("");
  const [shorturl, setShorturl] = useState("");

  const [generated, setGenerated] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [generatedShorturl, setGeneratedShorturl] = useState("");

  const [expiration, setExpiration] = useState("never");

  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const scanURL = async () => {
    if (!url.trim()) {
      alert("Please enter a URL first");
      return;
    }

    try {
      setScanning(true);
      setScanResult(null);

      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Unable to scan URL");
        return;
      }

      console.log("ML RESULT:", result);
      setScanResult(result);
    } catch (error) {
      console.error("ML SCAN ERROR:", error);

      alert(
        "Unable to connect to the AI security scanner. Make sure the Python server is running."
      );
    } finally {
      setScanning(false);
    }
  };

  const generate = async () => {
    try {
      if (!url.trim()) {
        alert("Please enter a URL");
        return;
      }

      if (!shorturl.trim()) {
        alert("Please enter a custom short URL");
        return;
      }

      if (!scanResult) {
        alert("Please scan the URL for security first.");
        return;
      }

      if (scanResult.result === "phishing") {
        alert(
          "This URL has been detected as potentially phishing. Shortening is blocked."
        );
        return;
      }

      const originalURL = url.trim();
      const customShorturl = shorturl.trim();

      const lookupResponse = await fetch(
        "/api/lookup?shorturl=" +
          encodeURIComponent(customShorturl)
      );

      if (lookupResponse.ok) {
        const existing = await lookupResponse.json();

        setGeneratedShorturl(existing.shorturl);

        const existingGeneratedUrl =
          process.env.NEXT_PUBLIC_HOST +
          "/" +
          existing.shorturl;

        setGenerated(existingGeneratedUrl);

        const qrResponse = await fetch(
          "/api/qr?shorturl=" +
            encodeURIComponent(existing.shorturl)
        );

        const qrResult = await qrResponse.json();

        if (qrResponse.ok && qrResult.qrCode) {
          setQrCode(qrResult.qrCode);
        } else {
          setQrCode("");
          console.error("QR CODE ERROR:", qrResult);
        }

        setUrl("");
        setShorturl("");
        setScanResult(null);

        alert(
          "This short URL already exists. Showing the existing link and QR code."
        );

        return;
      }

      let expiresAt = null;

      if (expiration !== "never") {
        const now = new Date();

        if (expiration === "1day") {
          now.setDate(now.getDate() + 1);
        }

        if (expiration === "7days") {
          now.setDate(now.getDate() + 7);
        }

        if (expiration === "30days") {
          now.setDate(now.getDate() + 30);
        }

        expiresAt = now.toISOString();
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: originalURL,
          shorturl: customShorturl,
          expiresAt: expiresAt,
          security: {
            result: scanResult.result,
            phishing_probability:
              scanResult.phishing_probability,
            legitimate_probability:
              scanResult.legitimate_probability,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Something went wrong");
        return;
      }

      setGeneratedShorturl(customShorturl);

      const generatedUrl =
        process.env.NEXT_PUBLIC_HOST +
        "/" +
        customShorturl;

      setGenerated(generatedUrl);

      const qrResponse = await fetch(
        "/api/qr?shorturl=" +
          encodeURIComponent(customShorturl)
      );

      const qrResult = await qrResponse.json();

      if (qrResponse.ok && qrResult.qrCode) {
        setQrCode(qrResult.qrCode);
      } else {
        setQrCode("");
        console.error("QR CODE ERROR:", qrResult);
      }

      setUrl("");
      setShorturl("");
      setScanResult(null);

      alert(result.message || "URL Generated Successfully");
    } catch (error) {
      console.error("GENERATE ERROR:", error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 transition-colors dark:bg-[#050b14] dark:text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mb-5 inline-flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
              <span className="text-2xl">🛡️</span>
            </div>

            <h1 className="text-3xl font-extrabold md:text-4xl">
              Phish<span className="text-cyan-500 dark:text-cyan-400">Shield</span>
            </h1>

          </div>

          <h2 className="text-2xl font-bold md:text-3xl">
            Secure Your Links
          </h2>

          <p className="mt-3 text-slate-500 dark:text-gray-400">
            Scan your URL for phishing threats before creating a shortened link.
          </p>

        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-white/[0.04] md:p-8">

          {/* Security indicator */}
          <div className="mb-7 flex items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-400/10 dark:bg-cyan-500/5">

            <span className="text-2xl">🔐</span>

            <div>
              <p className="font-semibold text-cyan-600 dark:text-cyan-300">
                PhishShield Security Scanner
              </p>

              <p className="text-sm text-slate-500 dark:text-gray-500">
                AI-powered URL analysis
              </p>
            </div>

          </div>

          {/* Original URL */}
          <div className="flex flex-col gap-3">

            <label className="font-semibold text-slate-700 dark:text-gray-200">
              🔗 URL to Analyze
            </label>

            <input
              type="text"
              value={url}
              placeholder="https://example.com"
              onChange={(e) => {
                setUrl(e.target.value);
                setScanResult(null);
              }}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 placeholder-slate-400 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-gray-600"
            />

            {/* Custom URL */}
            <label className="mt-3 font-semibold text-slate-700 dark:text-gray-200">
              ⚡ Custom Short URL
            </label>

            <input
              type="text"
              value={shorturl}
              placeholder="Enter your preferred short URL"
              onChange={(e) => setShorturl(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 placeholder-slate-400 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-gray-600"
            />

            {/* Expiration */}
            <label className="mt-3 font-semibold text-slate-700 dark:text-gray-200">
              ⏱️ Link Expiration
            </label>

            <select
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 transition focus:border-cyan-400 focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
            >
              <option value="never">Never</option>
              <option value="1day">1 Day</option>
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
            </select>

            {/* Scan */}
            <button
              onClick={scanURL}
              disabled={scanning}
              className="mt-4 w-full rounded-xl bg-cyan-500 p-4 font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50"
            >
              {scanning
                ? "🔍 Analyzing URL..."
                : "🛡️ Scan URL for Phishing"}
            </button>

          </div>

          {/* Security Result */}
          {scanResult && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-black/20">

              <h2 className="mb-5 text-xl font-bold">
                🛡️ Security Analysis
              </h2>

              <p className="mb-4 break-all text-sm text-slate-500 dark:text-gray-400">
                <strong className="text-slate-700 dark:text-gray-200">
                  URL:
                </strong>{" "}
                {scanResult.url}
              </p>

              {/* Probabilities */}
              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-400/20 dark:bg-red-500/10">

                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Phishing Probability
                  </p>

                  <p className="mt-1 text-3xl font-bold text-red-500 dark:text-red-400">
                    {scanResult.phishing_probability}%
                  </p>

                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-400/20 dark:bg-green-500/10">

                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Legitimate Probability
                  </p>

                  <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
                    {scanResult.legitimate_probability}%
                  </p>

                </div>

              </div>

              {/* Phishing */}
              {scanResult.result === "phishing" ? (

                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-400/20 dark:bg-red-500/10">

                  <h3 className="text-xl font-bold text-red-500 dark:text-red-400">
                    🚨 Potential Phishing URL
                  </h3>

                  <p className="mt-5 font-semibold text-slate-800 dark:text-gray-200">
                    Why it was flagged
                  </p>

                  {scanResult.security_analysis?.warnings?.length > 0 ? (

                    <ul className="ml-6 mt-3 list-disc space-y-2 text-slate-600 dark:text-gray-400">

                      {scanResult.security_analysis.warnings.map(
                        (warning, index) => (
                          <li key={index}>{warning}</li>
                        )
                      )}

                    </ul>

                  ) : (

                    <p className="mt-3 text-slate-600 dark:text-gray-400">
                      The ML model detected characteristics associated with phishing URLs.
                    </p>

                  )}

                  {scanResult.security_analysis?.positive_signals?.length > 0 && (

                    <div className="mt-5">

                      <p className="font-semibold text-slate-800 dark:text-gray-200">
                        Positive Security Signals
                      </p>

                      <ul className="ml-6 mt-3 list-disc space-y-2 text-slate-600 dark:text-gray-400">

                        {scanResult.security_analysis.positive_signals.map(
                          (signal, index) => (
                            <li key={index}>{signal}</li>
                          )
                        )}

                      </ul>

                    </div>

                  )}

                  <div className="mt-5 rounded-xl border border-red-200 bg-red-100 p-4 font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                    🚫 Recommended Action: Do not open this link.
                  </div>

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-400/20 dark:bg-green-500/10">

                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                    🟢 URL Appears Legitimate
                  </h3>

                  <p className="mt-5 font-semibold text-slate-800 dark:text-gray-200">
                    Security Analysis
                  </p>

                  {scanResult.security_analysis?.positive_signals?.length > 0 && (

                    <ul className="ml-6 mt-3 list-disc space-y-2 text-slate-600 dark:text-gray-400">

                      {scanResult.security_analysis.positive_signals.map(
                        (signal, index) => (
                          <li key={index}>{signal}</li>
                        )
                      )}

                    </ul>

                  )}

                  {scanResult.security_analysis?.warnings?.length > 0 && (

                    <div className="mt-5">

                      <p className="font-semibold text-slate-800 dark:text-gray-200">
                        Additional Warnings
                      </p>

                      <ul className="ml-6 mt-3 list-disc space-y-2 text-slate-600 dark:text-gray-400">

                        {scanResult.security_analysis.warnings.map(
                          (warning, index) => (
                            <li key={index}>{warning}</li>
                          )
                        )}

                      </ul>

                    </div>

                  )}

                  <div className="mt-5 rounded-xl border border-green-200 bg-green-100 p-4 font-semibold text-green-700 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-300">
                    🤖 AI Confidence: {scanResult.confidence}%
                  </div>

                </div>

              )}

            </div>
          )}

          {/* Generate Button */}
          {scanResult &&
            scanResult.result === "legitimate" && (

            <button
              onClick={generate}
              className="mt-6 w-full rounded-xl bg-green-500 p-4 font-bold text-black transition-all hover:bg-green-400 active:scale-[0.98]"
            >
              🔗 Generate Secure Short URL
            </button>

          )}

          {/* Generated URL */}
          {generated && (

            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-400/20 dark:bg-black/20">

              <span className="text-xl font-bold">
                ✅ Secure Short Link Created
              </span>

              <code className="mt-4 block break-all rounded-xl border border-slate-200 bg-white p-4 text-cyan-600 dark:border-white/10 dark:bg-black/30 dark:text-cyan-300">

                <Link
                  target="_blank"
                  href={generated}
                  className="hover:underline"
                >
                  {generated}
                </Link>

              </code>

              {/* QR Code */}
              {qrCode && (

                <div className="mt-7 flex flex-col items-center gap-4">

                  <span className="text-lg font-bold">
                    📱 Scan QR Code
                  </span>

                  <div className="rounded-2xl bg-white p-4 shadow-xl">
                    <img
                      src={qrCode}
                      alt="PhishShield QR Code"
                      width={200}
                      height={200}
                    />
                  </div>

                  <a
                    href={qrCode}
                    download={
                      "phishshield-qr-" +
                      generatedShorturl +
                      ".png"
                    }
                    className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition-all hover:bg-cyan-400 active:scale-95"
                  >
                    Download QR Code
                  </a>

                </div>

              )}

            </div>

          )}

        </div>

        {/* Security footer */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-gray-500">
          <p>
            🛡️ PhishShield • Analyze links before you trust them.
          </p>
        </div>

      </div>
    </main>
  );
}