# Permanent portfolio storage

This app uses Supabase for permanent portfolio content and file storage. Without the two `VITE_SUPABASE_*` variables, it falls back to browser storage.

## Supabase

1. Create a free Supabase project.
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Open **Project Settings > API** and copy the Project URL and publishable anon key.

## Render environment variables

Add these to the Render service before redeploying:

```text
VITE_ADMIN_PASSWORD=your-admin-password
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
```

Use the publishable/anon key only. Never put the Supabase service-role key in a `VITE_` variable.

## Render

- Build command: `npm run build`
- Start command: `npm start`

Redeploy after adding or changing environment variables. Admin saves then update the `portfolio_content` row and become visible to every visitor. Resume PDFs and project images are uploaded to the `portfolio-assets` bucket and the database stores only their public URLs.
