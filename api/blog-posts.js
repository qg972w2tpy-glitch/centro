// Vercel function — fetches blog posts from Contentful
// Setup:
//   1. Create free account at contentful.com
//   2. Create a Space, then a Content Type called "blogPost" with fields:
//      - title (Short text, required)
//      - excerpt (Short text)
//      - category (Short text)
//      - readTime (Short text, e.g. "8 min")
//      - publishDate (Date)
//      - featured (Boolean)
//   3. In Vercel → Settings → Environment Variables, add:
//      CONTENTFUL_SPACE_ID = your_space_id
//      CONTENTFUL_ACCESS_TOKEN = your_delivery_api_token
//
// Without env vars, returns { ok: false } and the blog uses hardcoded data.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !token) {
    return res.status(200).json({ ok: false, reason: "not_configured" });
  }

  try {
    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=blogPost&order=-fields.publishDate&limit=50`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Contentful error:", err);
      return res.status(200).json({ ok: false, reason: "contentful_error" });
    }

    const json = await resp.json();
    const posts = (json.items || []).map(item => ({
      cat: item.fields.category || "Notas",
      title: item.fields.title || "",
      excerpt: item.fields.excerpt || "",
      read: item.fields.readTime || "5 min",
      date: item.fields.publishDate
        ? new Date(item.fields.publishDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
        : "",
      featured: item.fields.featured || false,
    }));

    return res.status(200).json({ ok: true, posts });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(200).json({ ok: false, reason: "network_error" });
  }
}
