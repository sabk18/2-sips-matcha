/**
 * Vercel serverless function — "10% off" email capture
 * (endpoint path kept as /api/waitlist for backwards compatibility; this
 * used to gate a pre-launch waitlist, now it gates a discount code since
 * the shop is live.)
 *
 * Set these environment variables in Vercel dashboard:
 *   RESEND_API_KEY   — from resend.com (free tier)
 *   NOTIFY_EMAIL     — your email, to get notified of signups
 *   FROM_EMAIL       — verified sender (e.g. onboarding@resend.dev for testing)
 *   DISCOUNT_CODE    — the Shopify discount code to send (create it in
 *                      Shopify Admin -> Discounts first, e.g. "WELCOME10")
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

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.log("[waitlist] would send email (no Resend configured):", { to, subject });
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
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[waitlist] Resend error:", err);
  }
}

async function notifyOwner(email) {
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!notifyEmail) return;

  await sendEmail({
    to: notifyEmail,
    subject: "New discount signup — 2 Sips Matcha",
    html: `
      <p>Someone signed up for the 10% off code:</p>
      <p><strong>${email}</strong></p>
      <p style="color:#888;font-size:12px;">Sent from 2 Sips Matcha</p>
    `,
  });
}

async function sendDiscountCode(email) {
  const code = process.env.DISCOUNT_CODE || "WELCOME10";

  await sendEmail({
    to: email,
    subject: "Here's your 10% off — 2 Sips Matcha",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Thanks for joining! Here's your code for 10% off your first order:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 0.05em; background: #f4f1ea; padding: 16px; text-align: center; border-radius: 8px;">
          ${code}
        </p>
        <p>Enter it at checkout on <a href="https://www.2sipsmatcha.com">2sipsmatcha.com</a>.</p>
        <p style="color:#888;font-size:12px;">2 Sips Matcha</p>
      </div>
    `,
  });
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
    await Promise.all([sendDiscountCode(email), notifyOwner(email)]);
    return res.status(200).json({ success: true, message: "Check your inbox for your code!" });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
