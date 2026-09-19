# TripLedger BD

**TripLedger BD** is a professional ERP + CRM foundation for Bangladesh travel agencies. It combines customer management, bookings, visa operations, supplier visibility, invoices, receivables, finance tracking, follow-ups and team permissions in one BDT-first workspace.

## What is included

The client-facing dashboard includes revenue, gross profit, active bookings and outstanding balance KPIs; sales pipeline and recent transaction views; responsive navigation; search and status filters; customer, booking, visa, invoice and follow-up tables; edit drawers; invoice creation; follow-up queueing; a Team access workspace; and a Bangladesh-specific UX with BDT, Dhaka timezone, Biman, Umrah, Schengen, UAE and Dubai examples.

The full-stack foundation includes Manus OAuth login, MySQL/TiDB persistence through Drizzle, protected tRPC procedures, team provisioning, admin-only role changes, customers, suppliers, bookings, visa cases, financial entries, invoices, stored documents and follow-up queue tables. Visa documents use the configured storage layer and store metadata plus a secure storage URL rather than file bytes in the database.

WhatsApp is implemented as a safe follow-up queue with channel, message, due time and status fields. Actual sending is intentionally provider-neutral until a WhatsApp Business API provider and credential are selected. The session has no WhatsApp connector configured; connect a provider such as Meta WhatsApp Cloud API or another approved BSP before enabling delivery.

## Live demo

The WebDev preview is available at:

<https://3000-ihlyzsj3a420b7goay3gi-e09b758c.us1.manus.computer>

A published project domain is also available at:

<https://tripledger-jkcbmwg6.manus.space>

The demo renders with realistic sample data before login. Use **Sign in** to load the live workspace and database-backed modules in an authenticated environment.

## Namecheap hosting options

### Option A — static client demo on ordinary shared hosting

This is the easiest client walkthrough and does not require Node.js or MySQL.

1. Run `pnpm install` and `pnpm build` from the project root.
2. Upload all contents of `dist/public/` to `public_html/` in cPanel, or upload the prepared `github-pages/` folder contents.
3. Keep the `assets/` directory beside `index.html`.
4. Open the domain. This static demo uses realistic local fallback data and does not persist live records.

A refreshed static export is included in `github-pages/`, and `tripledger-bd-static.zip` is included for convenient upload.

### Option B — full ERP on Namecheap with Node.js support

The live ERP requires a Node.js application, a MySQL-compatible database and environment variables. Ordinary static-only shared hosting cannot run the API.

1. Create a MySQL database and user in cPanel.
2. Upload the project source, excluding `node_modules`, or deploy from GitHub.
3. Run `pnpm install`, set `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` in the hosting environment.
4. Run `pnpm db:push` once against the new database.
5. Run `pnpm build` and configure the Node.js app entrypoint as `dist/index.js` with `NODE_ENV=production`.
6. Point the domain or subdomain to the Node.js app and add the exact OAuth callback URL: `/api/oauth/callback`.
7. Verify login, database queries, document upload and the storage proxy before client onboarding.

If the Namecheap plan does not expose a Node.js application, use Option A for the demo and host the full-stack build on a Node-capable VPS, Render, Railway, Fly.io, or the Manus project domain.

## GitHub Pages

The `github-pages/` directory is a relative-path static export intended for repository Pages hosting. Upload its contents to a `gh-pages` branch or configure Pages to serve the repository root or `/docs`. It is a presentation demo only; the live database and login API require the full-stack deployment described above.

## Local development

```bash
pnpm install
pnpm dev
```

Open the URL printed by the server. Validate the project with:

```bash
pnpm check
pnpm build
pnpm test
```

## Database and API modules

The schema contains `users`, `teams`, `teamMembers`, `customers`, `suppliers`, `bookings`, `visaCases`, `financialEntries`, `invoices`, `documents` and `followUps`. The tRPC routers expose protected list/create/update procedures for the operational modules, a dashboard summary query, document upload through storage, follow-up queueing, invoice creation and admin-only role updates.

## Commercial next steps

Before selling as a production SaaS, add branch-level tenancy rules, invitation emails, audit logs, invoice PDF/receipt templates, payment gateway reconciliation, scheduled overdue reminders, WhatsApp Cloud API templates and delivery callbacks, daily backups, retention controls, data export, stronger field validation and a dedicated accounting review workflow.
