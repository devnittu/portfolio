# Permanent portfolio storage

This app uses Supabase for permanent portfolio content and file storage. Without the two `VITE_SUPABASE_*` variables, it falls back to browser storage.

## Supabase

1. Create a free Supabase project.
2. For automatic repository deployments, use the `supabase/migrations/` folder. The migration in that folder creates the database table, policies, and asset bucket.
3. For a one-time manual setup, you can paste [`supabase/schema.sql`](supabase/schema.sql) into **SQL Editor**.
4. Open **Project Settings > API Keys** and copy the Project URL and **Publishable key**.

After connecting the repository, confirm the migration has run successfully in Supabase. In **Table Editor**, you should see `portfolio_content`. In **Storage**, you should see a public bucket named `portfolio-assets`. If either is missing, run the complete migration file manually in **SQL Editor** once.

## Render environment variables

Add these to the Render service before redeploying:

```text
VITE_ADMIN_PASSWORD=your-admin-password
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use the **Publishable key**. If your project only shows the older **anon** key, `VITE_SUPABASE_ANON_KEY` also works. Never put the Secret or service-role key in a `VITE_` variable.

`VITE_SUPABASE_URL` must be only the base Project URL, for example `https://abcdefghijklmnop.supabase.co`. Do not paste the dashboard URL, database connection string, or a URL ending in `/rest/v1`.

## Render

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`

Redeploy after adding or changing environment variables. Admin saves then update the `portfolio_content` row and become visible to every visitor. Resume PDFs and project images are uploaded to the `portfolio-assets` bucket and the database stores only their public URLs.

The repository includes `render.yaml` with these settings. For an existing Render service, update the Build Command manually or recreate it from the Blueprint so Render installs the React, Vite, TypeScript, and Supabase packages before building.

## Supabase GitHub integration

- Repository: `devnittu/portfolio`
- Working directory: `.`
- Production branch: `main`
- Enable **Deploy to production**.

Supabase will apply new files in `supabase/migrations/` when changes are merged into `main`. Do not use the PostgreSQL connection string in the frontend.
