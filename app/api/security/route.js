import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("url-shortener");
    const collection = db.collection("urls");

    const urls = await collection
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const total = urls.length;

    const low = urls.filter(
      (item) => item.security?.riskLevel === "LOW"
    ).length;

    const medium = urls.filter(
      (item) => item.security?.riskLevel === "MEDIUM"
    ).length;

    const high = urls.filter(
      (item) => item.security?.riskLevel === "HIGH"
    ).length;

    const unscanned = urls.filter(
      (item) => !item.security
    ).length;

    return NextResponse.json({
      success: true,
      statistics: {
        total,
        low,
        medium,
        high,
        unscanned,
      },
      urls,
    });

  } catch (error) {
    console.error("SECURITY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load security data",
      },
      {
        status: 500,
      }
    );
  }
}