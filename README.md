# 2 Sips Matcha

Site for **2 Sips Matcha** — premium ceremonial-grade matcha. Static HTML/CSS/JS, deployed on Vercel at [2sipsmatcha.com](https://www.2sipsmatcha.com).

## Structure

```
2-sips-matcha/
├── index.html       # Site markup (Hero, Story, Shop, 10%-off signup)
├── css/style.css    # Styles & brand colors
├── js/main.js       # 10%-off email-capture form logic
├── js/shop.js       # Shopify Buy Button embed (product/cart/checkout)
├── api/waitlist.js  # Vercel serverless function — emails the discount code
└── vercel.json      # Vercel config
```

## Shop / Shopify integration

The product lives in a dedicated Shopify store; the Shop section on this site embeds it via the Shopify **Buy Button** SDK (see `js/shop.js`), restyled to match the site's own palette/typography instead of Shopify's default widget look. Checkout, payments, shipping, and customer accounts are all handled by Shopify — this site itself never touches payment data.

To swap the product (new SKU, new tin size, etc.): generate a fresh Buy Button embed code in Shopify Admin (Sales channels → Buy Button), then update `PRODUCT_ID` / `NODE_ID` in `js/shop.js` and the matching `id` in `index.html`.

## "Get 10% off" email capture

`api/waitlist.js` is a Vercel serverless function that, on signup, emails the visitor a discount code (via [Resend](https://resend.com), free tier) and separately notifies you of the signup. Configure these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `NOTIFY_EMAIL` | Your email, to get notified of signups |
| `FROM_EMAIL` | Verified sender (use `onboarding@resend.dev` for testing) |
| `DISCOUNT_CODE` | The Shopify discount code to send (create it in Shopify Admin → Discounts first) |

Without `RESEND_API_KEY` set, signups still succeed but no email actually sends — logged in Vercel function logs instead.

## Local preview

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

Note: `/api/waitlist` only works when deployed to Vercel (or run via `vercel dev` locally).

## Brand colors

| Token | Hex | Usage |
|-------|-----|-------|
| Dusty background | `#E2EBE0` | Page background |
| Cream | `#F4F1EA` | Secondary background |
| Deep green | `#2A3F32` | Headings, buttons |
| Matcha green | `#4D6B52` | Accents |
| Sage | `#7A9478` | Subtle text |
| Warm accent | `#C4AD8A` | Links, highlights |

Update `:root` variables in `css/style.css` to match your brand palette.
