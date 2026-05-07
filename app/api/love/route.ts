import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, from, message, memory, date, song, photoBase64 } = body;

    if (!to || !from || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let photoAsset = null;

    // Upload photo to Sanity if provided
    if (photoBase64) {
      try {
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const uploaded = await sanityClient.assets.upload("image", buffer, {
          filename: `photo-${Date.now()}.jpg`,
          contentType: "image/jpeg",
        });
        photoAsset = { _type: "image", asset: { _type: "reference", _ref: uploaded._id } };
      } catch (photoErr) {
        console.error("Photo upload failed (continuing without photo):", photoErr);
      }
    }

    // Create the document
    const doc = await sanityClient.create({
      _type: "loveStory",
      to: to.trim(),
      from: from.trim(),
      message: message.trim(),
      memory: memory?.trim() || "",
      date: date || "",
      song: song?.trim() || "",
      ...(photoAsset ? { photo: photoAsset } : {}),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: doc._id });
  } catch (err) {
    console.error("Create love story error:", err);
    return NextResponse.json({ error: "Failed to create love story" }, { status: 500 });
  }
}
