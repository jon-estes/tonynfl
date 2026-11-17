/* ============================================================
   POOL PHOTOS — the photo wall's list of pictures
   ============================================================
   The photos themselves live in Cloudinary (uploaded straight from
   the browser with Cloudinary's upload widget, same as the
   clementinexiong.com album). This function only keeps the LIST of
   uploaded photos (url, who, caption, when) in Netlify Blobs, so no
   secret key ever has to sit in the page's source code.

   GET    /.netlify/functions/pool-photos           -> { photos: [...] } newest first
   POST   /.netlify/functions/pool-photos           body { url, type, name, caption }
   DELETE /.netlify/functions/pool-photos?id=...    header x-admin-key: <PHOTO_ADMIN_KEY>

   To remove a photo: set an environment variable PHOTO_ADMIN_KEY in
   Netlify (Project configuration > Environment variables) and use the
   little "Remove" link that shows on each photo when the page is
   opened as /?admin=1.
   ============================================================ */
import { getStore } from "@netlify/blobs";

const CLOUD_NAME = "yhqomgew";
const URL_OK = new RegExp(`^https://res\\.cloudinary\\.com/${CLOUD_NAME}/(image|video)/upload/[A-Za-z0-9_\\-./%]+$`);
const KEY = "photos";
const MAX_PHOTOS = 600;

const json = (status, obj) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });

const clean = (s, max) => String(s || "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);

export default async (req) => {
  const store = getStore({ name: "pool-photos", consistency: "strong" });
  const list = (await store.get(KEY, { type: "json" })) || [];

  if (req.method === "GET") {
    return json(200, { photos: list.slice().reverse() });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json(400, { error: "Bad JSON" }); }
    const url = String(body.url || "");
    if (!URL_OK.test(url)) return json(400, { error: "Only Cloudinary uploads from this site are allowed" });
    if (list.some(p => p.url === url)) return json(200, { ok: true, duplicate: true });
    const photo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      url,
      type: body.type === "video" ? "video" : "image",
      name: clean(body.name, 40),
      caption: clean(body.caption, 140),
      at: new Date().toISOString()
    };
    list.push(photo);
    await store.setJSON(KEY, list.slice(-MAX_PHOTOS));
    return json(200, { ok: true, photo });
  }

  if (req.method === "DELETE") {
    const adminKey = process.env.PHOTO_ADMIN_KEY;
    if (!adminKey || req.headers.get("x-admin-key") !== adminKey) return json(403, { error: "Not allowed" });
    const id = new URL(req.url).searchParams.get("id");
    const next = list.filter(p => p.id !== id);
    await store.setJSON(KEY, next);
    return json(200, { ok: true, removed: list.length - next.length });
  }

  return json(405, { error: "Method not allowed" });
};
