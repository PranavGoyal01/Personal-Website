# Personal Website — README

This repository scaffolds a Next.js portfolio site for Pranav Goyal.

Getting started (local):

1. Install dependencies

```bash
npm install
```

2. Copy your assets into the repo root:
- `resume.pdf` (copy from: C:\Users\prana\Documents\Pranav Goyal - Resume.pdf)
- `professional_headshot.jpg` (copy from: C:\Users\prana\Pictures\professional_headshot.jpg)

3. Create a `.env.local` with the following variables (placeholders):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=you@yourdomain.com
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Run the dev server

```bash
npm run dev
```

Notes:
- The site scaffold is on branch `site/scaffold` — create a PR before merging to `main`.
- Do NOT commit secrets; use Vercel environment variables for production.
