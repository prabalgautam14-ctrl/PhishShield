import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { shorturl } = await request.json();

    if (!shorturl) {
      return NextResponse.json(
        { error: "Short URL is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("url-shortener");

    const result = await db.collection("urls").updateOne(
      { shorturl: shorturl },
      {
        $inc: {
          clicks: 1,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Click recorded",
    });
  } catch (error) {
    console.error("CLICK TRACKING ERROR:", error);

    return NextResponse.json(
      { error: "Failed to record click" },
      { status: 500 }
    );
  }
}