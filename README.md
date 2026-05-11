# NovaMart

A modern e-commerce storefront built with Next.js 16, TypeScript, and Tailwind CSS. Backed by Supabase for authentication, order persistence, and contact form storage.

**Live:** https://novamart-indol.vercel.app

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS
- **Auth & DB:** Supabase (Auth, Postgres, RLS)
- **Deployment:** Vercel
- **Language:** TypeScript

## Features

- Product catalog with categories, search, and filtering
- Product detail pages with size/color selection and image gallery
- Shopping cart with quantity management (localStorage)
- Full checkout flow (shipping, payment, order confirmation)
- User authentication (sign up, sign in, account management)
- Order history
- Contact form with validation
- Responsive design (mobile + desktop)
- 404 page

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Project Structure

```
src/
  app/          # Next.js App Router pages
  components/   # Shared UI components (Header, Footer)
  data/         # Product data and cart store
  lib/          # Supabase client and auth context
supabase/
  schema.sql    # Database schema
```
