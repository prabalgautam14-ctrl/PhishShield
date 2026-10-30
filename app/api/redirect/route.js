import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const shorturl = searchParams.get("shorturl");

    if (!shorturl) {
      return NextResponse.json(
        {
          success: false,
          message: "Short URL is required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("url-shortener");
    const collection = db.collection("urls");

    const doc = await collection.findOne({
      shorturl: shorturl.trim(),
    });

    console.log("REDIRECT DOCUMENT:", doc);

    if (!doc) {
      return NextResponse.json(
        {
          success: false,
          message: "Short URL not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check expiration
    if (doc.expiresAt) {
      const currentTime = new Date();
      const expirationTime = new Date(doc.expiresAt);

      if (currentTime >= expirationTime) {
        return NextResponse.json(
          {
            success: false,
            message: "This link has expired",
          },
          {
            status: 410,
          }
        );
      }
    }

    // Support old and new MongoDB field names
    let originalURL =
      doc.url ||
      doc.originalUrl ||
      doc.originalURL;

    if (!originalURL) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination URL not found",
        },
        {
          status: 404,
        }
      );
    }

    originalURL = String(originalURL).trim();

    // Add HTTPS if protocol is missing
    if (
      !originalURL.startsWith("http://") &&
      !originalURL.startsWith("https://")
    ) {
      originalURL = "https://" + originalURL;
    }

    // Validate URL
    try {
      new URL(originalURL);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid destination URL",
        },
        {
          status: 400,
        }
      );
    }

    console.log("FINAL REDIRECT:", originalURL);

    return NextResponse.json({
      success: true,
      url: originalURL,
    });

  } catch (error) {
    console.error("REDIRECT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}