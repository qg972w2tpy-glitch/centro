// Vercel serverless function — sends wizard form email via Resend
// Setup (one-time):
//   1. Sign up free at resend.com
//   2. In Vercel dashboard → Settings → Environment Variables, add:
//      RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx
//   3. Optionally verify your domain in Resend and update the `from` address below
//
// Without RESEND_API_KEY the function returns { ok: false, fallback: true }
// and the wizard falls back to the mailto: approach.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ ok: false, fallback: true });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { subject, text, attachments = [] } = body;

  if (!subject || !text) {
    return res.status(400).json({ error: "Missing subject or text" });
  }

  // CONTACT_EMAIL must match the email you registered in Resend
  // (Resend test domain only delivers to the account owner's email)
  const contactEmail = process.env.CONTACT_EMAIL || "centrostudio.ar@gmail.com";

  const emailPayload = {
    from: "Centro Studio <onboarding@resend.dev>",
    to: [contactEmail],
    subject,
    text,
    attachments: attachments.map(a => ({
      filename: a.name,
      content: a.data,
    })),
  };

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const resendBody = await resp.text();
    if (!resp.ok) {
      console.error("Resend error:", resendBody);
      return res.status(200).json({ ok: false, resendError: resendBody });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
