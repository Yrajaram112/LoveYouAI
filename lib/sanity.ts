import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// ── These env vars need to be set by the user after creating a Sanity project ──
// NEXT_PUBLIC_SANITY_PROJECT_ID  — from sanity.io/manage
// NEXT_PUBLIC_SANITY_DATASET     — usually "production"
// SANITY_API_TOKEN               — write token (server-side only)

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // CDN requires public dataset or token — disabled to avoid auth errors
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN || undefined,
});

const builder = imageUrlBuilder(readClient);
export const urlFor = (source: any) => builder.image(source);

// ── Schema (applied via API on first run — see README) ──────────────────────
export const LOVE_SCHEMA = {
  name: "loveStory",
  type: "document",
  fields: [
    { name: "to", type: "string" },
    { name: "from", type: "string" },
    { name: "message", type: "text" },
    { name: "memory", type: "text" },
    { name: "date", type: "string" },   // ISO date string
    { name: "song", type: "string" },
    { name: "photo", type: "image" },
    { name: "slug", type: "slug", options: { source: "to" } },
    { name: "createdAt", type: "datetime" },
  ],
};

export const SORRY_SCHEMA = {
  name: "sorryStory",
  type: "document",
  fields: [
    { name: "to", type: "string" },
    { name: "from", type: "string" },
    { name: "apology", type: "text" },
    { name: "reasons", type: "array", of: [{ type: "string" }] },
    { name: "extra", type: "text" },   // message shown after forgiven
    { name: "forgiven", type: "boolean" },
    { name: "forgivenAt", type: "datetime" },
    { name: "createdAt", type: "datetime" },
  ],
};

// ── GROQ queries ──────────────────────────────────────────────────────────────
export const LOVE_QUERY = `*[_type == "loveStory" && _id == $id][0]{
  _id, to, from, message, memory, date, song, createdAt,
  photo{ asset->{ url } }
}`;

export const SORRY_QUERY = `*[_type == "sorryStory" && _id == $id][0]{
  _id, to, from, apology, reasons, extra, forgiven, forgivenAt
}`;