import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("url-shortener");

    const urls = await db
      .collection("urls")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const links = urls.map((item) => ({
      shorturl: item.shorturl,
      url: item.url,
      clicks: item.clicks || 0,
      expiresAt: item.expiresAt || null,
      security: item.security || null,
    }));

    return NextResponse.json({
      success: true,
      links: links,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics",
      },
      { status: 500 }
    );
  }
}