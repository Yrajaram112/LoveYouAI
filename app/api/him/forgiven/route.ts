import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await sanityClient.patch(id).set({
      forgiven: true,
      forgivenAt: new Date().toISOString(),
    }).commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Him forgiven patch error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
