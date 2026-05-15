// Vercel serverless function — sends wizard form email via Brevo (ex-Sendinblue)
// Setup (one-time):
//   1. Sign up free at brevo.com with centrostudio.ar@gmail.com
//   2. Go to Settings → SMTP & API → API Keys → Generate a new API key
//   3. In Vercel dashboard → Settings → Environment Variables, add:
//      BREVO_API_KEY = xkeysib-xxxxxxxxxxxxxxxxxxxx
//
// Without BREVO_API_KEY the function returns { ok: false, fallback: true }
// and the wizard falls back to the mailto: approach.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.BREVO_API_KEY;
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

  const emailPayload = {
    sender: { name: "Centro Studio", email: "centrostudio.ar@gmail.com" },
    to: [{ email: "centrostudio.ar@gmail.com", name: "Centro Studio" }],
    subject,
    textContent: text,
    attachment: attachments.map(a => ({
      name: a.name,
      content: a.data,
    })),
  };

  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const brevoBody = await resp.text();
    if (!resp.ok) {
      console.error("Brevo error:", brevoBody);
      return res.status(200).json({ ok: false, brevoError: brevoBody });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
