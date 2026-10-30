import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        {
          error: "URL is required",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // 1. Clean URL
    // -----------------------------

    let cleanURL = url.trim();

    if (
      !cleanURL.startsWith("http://") &&
      !cleanURL.startsWith("https://")
    ) {
      cleanURL = "https://" + cleanURL;
    }

    // -----------------------------
    // 2. Validate URL
    // -----------------------------

    let parsedURL;

    try {
      parsedURL = new URL(cleanURL);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid URL",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // 3. Rule-based detection
    // -----------------------------

    let ruleScore = 0;

    const reasons = [];

    // HTTPS
    if (parsedURL.protocol !== "https:") {
      ruleScore += 10;

      reasons.push(
        "Website does not use HTTPS"
      );
    }

    // URL length
    if (cleanURL.length > 100) {
      ruleScore += 10;

      reasons.push(
        "URL is unusually long"
      );
    }

    // IP address
    const ipPattern =
      /^(\d{1,3}\.){3}\d{1,3}$/;

    if (ipPattern.test(parsedURL.hostname)) {
      ruleScore += 25;

      reasons.push(
        "URL uses an IP address instead of a domain"
      );
    }

    // @ symbol
    if (cleanURL.includes("@")) {
      ruleScore += 25;

      reasons.push(
        "URL contains @ symbol"
      );
    }

    // Suspicious keywords
    const suspiciousWords = [
      "login",
      "signin",
      "verify",
      "verification",
      "account",
      "password",
      "secure",
      "update",
      "confirm",
      "bank",
    ];

    const lowerURL =
      cleanURL.toLowerCase();

    const foundWords =
      suspiciousWords.filter(
        (word) =>
          lowerURL.includes(word)
      );

    if (foundWords.length > 0) {
      ruleScore += 10;

      reasons.push(
        `Suspicious keyword detected: ${foundWords.join(
          ", "
        )}`
      );
    }

    // Too many subdomains
    const hostnameParts =
      parsedURL.hostname.split(".");

    if (hostnameParts.length > 4) {
      ruleScore += 15;

      reasons.push(
        "URL contains too many subdomains"
      );
    }

    ruleScore = Math.min(
      ruleScore,
      100
    );

    // -----------------------------
    // 4. Call Python ML API
    // -----------------------------

    let mlResult = null;

    try {
      const mlResponse =
        await fetch(
          "http://127.0.0.1:8000/predict",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              url: cleanURL,
            }),

            cache: "no-store",
          }
        );

      if (mlResponse.ok) {
        mlResult =
          await mlResponse.json();

        console.log(
          "ML RESULT:",
          mlResult
        );
      } else {
        console.error(
          "ML API returned error:",
          mlResponse.status
        );
      }
    } catch (error) {
      console.error(
        "ML API CONNECTION ERROR:",
        error
      );
    }

    // -----------------------------
    // 5. Calculate combined score
    // -----------------------------

    let riskScore = ruleScore;

    if (mlResult) {
      const mlScore =
        mlResult.phishingProbability;

      // 50% rules + 50% ML
      riskScore = Math.round(
        ruleScore * 0.5 +
          mlScore * 0.5
      );
    }

    riskScore = Math.min(
      Math.max(riskScore, 0),
      100
    );

    // -----------------------------
    // 6. Risk level
    // -----------------------------

    let riskLevel;

    if (riskScore < 30) {
      riskLevel = "LOW";
    } else if (riskScore < 60) {
      riskLevel = "MEDIUM";
    } else {
      riskLevel = "HIGH";
    }

    // -----------------------------
    // 7. Suspicious decision
    // -----------------------------

    const isSuspicious =
      riskScore >= 60;

    // -----------------------------
    // 8. Return result
    // -----------------------------

    return NextResponse.json({
      success: true,

      url: cleanURL,

      riskScore,

      riskLevel,

      isSuspicious,

      reasons,

      ruleScore,

      ml: mlResult
        ? {
            prediction:
              mlResult.prediction,

            phishingProbability:
              mlResult.phishingProbability,

            legitimateProbability:
              mlResult.legitimateProbability,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "SCAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while scanning",
      },
      {
        status: 500,
      }
    );
  }
}