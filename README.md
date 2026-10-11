# imsrikanth — Stitch design + Supabase backend + Admin panel

Design, CSS, fonts, animations: **untouched** (`src/index.css` and every className are identical).
Only the *data source* changed: hard-coded strings/arrays → Supabase (with the old values kept as fallback).

## Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Vite + React 19 + Tailwind 4 (as-is) | Switching to Next.js would risk the design; not needed |
| DB + Auth + Storage | **Supabase** (Postgres) | One free service for data, login and images; Row Level Security protects writes |
| Hosting | Vercel (static Vite build) | `vercel.json` included |

## Setup (≈ 15 min)
1. **Supabase**: supabase.com → New project. Save the DB password somewhere.
2. **SQL**: SQL Editor → paste `supabase/schema.sql` → replace `YOUR_ADMIN_EMAIL` → Run.
3. **Admin user**: Authentication → Users → Add user (that email + strong password, tick "Auto confirm").
4. **Disable signups**: Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".
5. **Keys**: Project Settings → API → copy *Project URL* and *anon public* key.
6. **Local run**:
   ```bash
   cp .env.example .env      # paste the two values
   npm install
   npm run dev
   ```
7. Click **Admin** → log in → **Site Content → Setup → "Publish built-in content to database"** (one time).
   This copies all current text + uploads the bundled images to Supabase Storage.
8. **Vercel**: push to GitHub → vercel.com → Add New Project → import repo → Environment Variables:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` → Deploy. (Add your Vercel URL under Supabase → Authentication → URL Configuration → Site URL.)

## What is editable now
- Navbar items: label, link, order, show/hide, add/delete (incl. the "Resume (Download)" item)
- Brand name / real name / role / bio / skills / contact / socials → *Info Editor* tab (now saved to the DB)
- Every UI label (hero buttons, section eyebrows & titles, footer, "Type / True Black / Admin"…) → *Texts*
- Hero metric bar, Projects, Advertising campaigns, Experience, Brand ticker, profile portrait
- Contact-form messages arrive in the *Client Tickets* tab (stored in DB, only you can read them)

## Adding a new editable text
1. Add `'section.key': 'Default text'` to `DEFAULT_TEXTS` in `src/lib/defaults.ts`
2. In the component: `const { t } = useContent();` then `{t('section.key')}`
It shows up in Admin → Texts automatically.

## Folder structure (new/changed only)
```
supabase/schema.sql              tables, RLS policies, storage bucket
vercel.json
.env.example
src/
  lib/supabase.ts                client
  lib/defaults.ts                default nav / texts / metrics (old hard-coded values)
  lib/seed.ts                    one-time image migration helper
  context/ContentContext.tsx     loads DB → React, save functions, admin session
  components/admin/
    ContentAdmin.tsx             tabs: Navigation, Texts, Hero stats, Projects, …
    RecordsEditor.tsx            reusable add/edit/reorder/delete list editor
    ImageUploader.tsx            resize → WebP → Supabase Storage
  components/AdminPanelModal.tsx real login (replaces 'admin123')
  components/Navbar.tsx, HeroSection.tsx, *Section.tsx   text/data now from context
  main.tsx, App.tsx              wrapped in <ContentProvider>
```

## Security notes
- The old `admin123` passcode lived in the browser bundle (anyone could read it). It's gone; login is now Supabase Auth.
- Write access is enforced in the database (`is_admin()` + RLS), not in the UI.
- The anon key is public by design. **Never** put the `service_role` key in this project.


---
## v2 — Public site vs `/admin`
- **Public site (`/`)**: no Type / True Black / Admin buttons, no animation switcher, no admin link in the footer.
  Theme, typography and hero animation are read from the database (`site_content.theme`).
- **Admin (`/admin`)**: login form → dashboard with 4 tabs
  - *Appearance*: theme (True Black / Midnight / Custom colours), typography pair, hero animation (Grid / Code / Pulse)
  - *Hero, Contact & Social*: hero heading + sub-text, real name, email, phone, WhatsApp, Instagram, LinkedIn, bio, skills, education, CV upload
  - *Site Content*: navigation (add/edit/reorder/hide), texts, hero stats, projects, ad campaigns, experience, brand ticker, portrait
  - *Inbox*: contact-form messages
- Every change saves instantly. Open visitor tabs update live once you run `supabase/migration-002-realtime.sql` once;
  otherwise visitors see changes on their next refresh or when they return to the tab.
- `/admin` is loaded as a separate JS chunk (visitors never download it) and is marked `noindex`.

## Environment variables (Vercel)
Only two are needed: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. There is no `ADMIN_SECRET_KEY` / `DATABASE_URL`:
this is a static site, and anything secret placed in a `VITE_` variable would be public. Admin identity lives in Supabase Auth + the `is_admin()` rule.
