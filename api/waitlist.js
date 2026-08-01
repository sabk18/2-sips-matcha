/**
 * Vercel serverless function — waitlist signup
 *
 * Set these environment variables in Vercel dashboard:
 *   RESEND_API_KEY  — from resend.com (free tier)
 *   NOTIFY_EMAIL    — your email to receive signups
 *   FROM_EMAIL      — verified sender (e.g. onboarding@resend.dev for testing)
 */

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGIN
  ? [process.env.ALLOWED_ORIGIN]
  : null;

function corsHeaders(origin) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (!ALLOWED_ORIGINS || ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin || "*";
  }

  headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";

  return headers;
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function notifyViaResend(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !notifyEmail) {
    console.log("[waitlist] signup (no Resend configured):", email);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `2 Sips Matcha <${fromEmail}>`,
      to: [notifyEmail],
      subject: "New waitlist signup — 2 Sips Matcha",
      html: `
        <p>Someone joined the waitlist:</p>
        <p><strong>${email}</strong></p>
        <p style="color:#888;font-size:12px;">Sent from 2 Sips Matcha waitlist</p>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[waitlist] Resend error:", err);
  }
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || "";

  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", origin || "*").end();
  }

  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const email = body?.email?.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    await notifyViaResend(email);
    return res.status(200).json({ success: true, message: "You're on the list!" });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
