import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const client = await clientPromise;

    const db = client.db("url-shortener");
    const collection = db.collection("urls");

    // Validate URL
    if (!body.url) {
      return Response.json(
        {
          success: false,
          error: true,
          message: "URL is required",
        },
        {
          status: 400,
        }
      );
    }

    // Validate short URL
    if (!body.shorturl) {
      return Response.json(
        {
          success: false,
          error: true,
          message: "Custom short URL is required",
        },
        {
          status: 400,
        }
      );
    }

    // Check if short URL already exists
    const doc = await collection.findOne({
      shorturl: body.shorturl,
    });

    if (doc) {
      return Response.json({
        success: false,
        error: true,
        message: "URL already exists!",
      });
    }

    // Insert URL into MongoDB
    await collection.insertOne({
      url: body.url,
      shorturl: body.shorturl,
      expiresAt: body.expiresAt || null,

      // Security information
      security: body.security || null,
    });

    return Response.json({
      success: true,
      error: false,
      message: "URL Generated Successfully",
    });

  } catch (error) {
    console.error("GENERATE ERROR:", error);

    return Response.json(
      {
        success: false,
        error: true,
        message: "Something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}