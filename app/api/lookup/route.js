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

    const originalURL =
      doc.url ||
      doc.originalUrl ||
      doc.originalURL;

    return NextResponse.json({
      success: true,
      shorturl: doc.shorturl,
      url: originalURL,
      expiresAt: doc.expiresAt || null,
      security: doc.security || null,
    });

  } catch (error) {
    console.error("LOOKUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}