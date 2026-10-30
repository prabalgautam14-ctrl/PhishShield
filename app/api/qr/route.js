import QRCode from "qrcode";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    // Get shorturl from the request
    const { searchParams } = new URL(request.url);
    const shorturl = searchParams.get("shorturl");

    // Check if shorturl was provided
    if (!shorturl) {
      return Response.json(
        { error: "Short URL is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("url-shortener");
    const collection = db.collection("urls");

    // Find the short URL in MongoDB
    const doc = await collection.findOne({ shorturl });

    if (!doc) {
      return Response.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Create your BitLinks short URL
    const shortUrl = `${process.env.NEXT_PUBLIC_HOST}/${shorturl}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl);

    // Send QR code to frontend
    return Response.json({ qrCode });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}