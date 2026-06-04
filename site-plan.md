Personal Website — Site Plan

Summary
- Owner: Pranav Goyal
- Purpose: Portfolio + job applications
- Deadline: 2026-06-18

Tech & Hosting
- Stack: Next.js + Tailwind + shadcn/ui + Supabase + Vercel
- Email sending: Resend (server-side); save submissions to Supabase
- CI/CD: GitHub → Vercel automatic deploys from `main`

Content & Structure
- Pages: Home, About, Projects, Resume (download + interactive), Now, Contact
- Hero project: AI-Cars-in-Real-Cities (highlight with 2–3 sentence blurb to finalize)
- Projects: DueForge; AI-Cars-in-Real-Cities; ETF-Arbitrage; Lost-n-Found; The-Mona-Lisa-CPU; Full-Stack-Encryption-Service
- Project card fields: problem, approach, tech, repo link

Assets & Data
- Contact email: pranavgoyal0711@gmail.com
- Resume (local): C:\Users\prana\Documents\Pranav Goyal - Resume.pdf — please confirm if I should copy into repo
- Headshot (local): C:\Users\prana\Pictures\professional_headshot.jpg — please confirm copy into repo as `professional_headshot.jpg`
- Brand color: #0b0b0b (dark) + accent #e11d30; font: Inter
- Analytics: GA4 (Measurement ID to be added later)

Features & Integrations
- Contact form: Vercel serverless function using Resend, store submissions in Supabase
- Admin: Minimal dashboard backed by Supabase for editing hero blurb, project visibility, and contact entries
- Accessibility: high-contrast option, ARIA-friendly components
- Dark mode toggle (user preference persisted)
- Placeholder thumbnails for projects until screenshots provided

Security & Privacy
- Do not expose API keys in repo; use Vercel environment variables
- Privacy: include minimal privacy policy and cookie consent for analytics

Workflow & Deliverables
- Repo: Personal-Website (public, MIT)
- Branching: create feature branch `site/scaffold` → PR → merge to `main`
- Deliverables by deadline: live site on Vercel, README with update instructions, admin dashboard (Supabase), resume + headshot in repo

Next immediate steps (I'll take after you confirm):
1. Copy resume & headshot into repo (with your OK).
2. Create `site/scaffold` branch and scaffold Next.js app with Tailwind and shadcn/ui.
3. Implement Home page with hero project, Projects listing, and Contact form backend (Resend + Supabase).

Notes
- Domain: pgoyal.us (Porkbun → plan to transfer to Cloudflare later). See `notes.md` for transfer checklist.

Timestamp: 2026-06-04
