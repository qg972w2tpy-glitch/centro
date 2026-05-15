import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "centrostudio.ar@gmail.com",
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: "Centro Studio <centrostudio.ar@gmail.com>",
    to: "centrostudio.ar@gmail.com",
    subject,
    text,
    attachments: attachments.map(a => ({
      filename: a.name,
      content: Buffer.from(a.data, "base64"),
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Gmail error:", err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
