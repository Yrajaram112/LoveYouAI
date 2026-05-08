import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, from, apology, reasons, extra, comeback } = body;

    if (!to || !from || !apology) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doc = await sanityClient.create({
      _type: "himSorry",
      to: to.trim(),
      from: from.trim(),
      apology: apology.trim(),
      reasons: (reasons || []).filter(Boolean),
      extra: extra?.trim() || "",
      comeback: comeback?.trim() || "",
      forgiven: false,
      forgivenAt: null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: doc._id });
  } catch (err) {
    console.error("Create him sorry error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
