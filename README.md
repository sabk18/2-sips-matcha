# 2 Sips Matcha

Landing page with waitlist for **2 Sips Matcha** — premium ceremonial-grade matcha.

## Local preview

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 3000
# visit http://localhost:3000
```

> Note: the waitlist API (`/api/waitlist`) only works when deployed to Vercel.

## Deploy to Vercel + GitHub

### 1. Push to GitHub

```bash
cd ~/Projects/2-sips-matcha
git init
git add .
git commit -m "Initial landing page with waitlist"
gh repo create 2-sips-matcha --public --source=. --push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. **Add New Project** → import `2-sips-matcha`
3. Click **Deploy** (no build settings needed — static site)

Your site will be live at `https://2-sips-matcha.vercel.app` (or similar).

### 3. Configure waitlist notifications (optional)

Sign up at [resend.com](https://resend.com) (free tier) and add these env vars in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `NOTIFY_EMAIL` | Your email to receive signups |
| `FROM_EMAIL` | Verified sender domain (use `onboarding@resend.dev` for testing) |

Without these, signups still succeed — they're logged in Vercel function logs.

### 4. Custom domain

In Vercel → Project → Settings → Domains, add your domain (e.g. `2sipsmatcha.com`).

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

## Project structure

```
2-sips-matcha/
├── index.html       # Landing page
├── css/style.css    # Styles & brand colors
├── js/main.js       # Waitlist form logic
├── api/waitlist.js  # Vercel serverless API
└── vercel.json      # Vercel config
```
