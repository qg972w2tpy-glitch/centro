// Sube una imagen de referencia a Vercel Blob y devuelve su link público.
// Sin BLOB_READ_WRITE_TOKEN responde { ok: false } y el sitio sigue
// funcionando igual, sólo que sin links en el mensaje de WhatsApp.
import { put } from "@vercel/blob";

export const config = { api: { bodyParser: { sizeLimit: "6mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ ok: false, reason: "not_configured" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, data, type } = body || {};
    if (!data) return res.status(400).json({ error: "Missing data" });

    const buf = Buffer.from(data, "base64");
    if (!buf.length || buf.length > 6 * 1024 * 1024) {
      return res.status(200).json({ ok: false, reason: "size" });
    }

    const safe = String(name || "ref.jpg")
      .replace(/[^A-Za-z0-9._-]/g, "_")
      .slice(-60);
    const stamp = new Date().toISOString().slice(0, 10);

    const blob = await put(`cotizaciones/${stamp}/${safe}`, buf, {
      access: "public",
      contentType: type || "image/jpeg",
      addRandomSuffix: true,        // el link no se puede adivinar
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("upload-ref:", err);
    return res.status(200).json({ ok: false, reason: "error" });
  }
}
