# BINDY production setup

The existing Vercel project is `nethmika-gimhanas-projects/bindy-clothing`. Node 22 and Next.js 16.4.3 are configured. Source is uploaded with `.vercelignore`, excluding local credentials, source documents, working data, reports and build output.

## Storage and administration

The existing Supabase project `esreovoswlwccsfjyjph` has the legacy `bindy` schema. Its tables are preserved. The live application now uses the service-only `public.bindy_documents` store/owner documents with an atomic compare-and-swap RPC. Shared rate limits use a separate private table. Failed writes and conflicts are surfaced instead of claiming success or falling back to ephemeral serverless memory. Migration: `supabase/migrations/202610280001_production_storage.sql`.

The initial live catalogue preserves the existing database's product names, descriptions, prices and available variant stock; current repository photography replaces obsolete mannequin views. Checkout starts paused. The legacy tables are retained for reference; new admin changes are authoritative in `bindy_documents`, not the old background sync tables. Keep Supabase backups enabled and export authenticated store backups periodically.

Uploads are owner-only, bounded to 4 MB, validated and re-encoded as metadata-free WebP (maximum 2400 x 3000). Supabase `bindy-media` is public for garment imagery; restrictive policies prevent anonymous/customer uploads, edits and deletes. No personal documents belong there.

A long random `ADMIN_SETUP_TOKEN` has been configured in the Vercel production environment as an encrypted variable. Before first owner sign-in, reveal it in the project Environment Variables screen, then visit `/admin` and create the owner account with your own password. Remove the bootstrap token after setup. There is no default production password. Owner passwords use scrypt; session tokens are hashed, expire after 12 hours and are sent only in HttpOnly/SameSite cookies. Setup is atomic and cannot create a second owner.

Promotions: `/admin/promotions`. Save draft offers, link an active discount from `/admin/discounts`, choose dates and publish. Only valid published offers appear on the homepage. Announcements/shipping/contact information are in Settings; policies and hero slides are in Store content. Seed testimonials, fabricated discounts/countdowns, fake financing claims, fake password accounts and the public test page were removed from active storefront flows.

## PayHere activation (merchant account is not approved yet)

Code is prepared; do not enable payments until all of these are complete:

1. Get merchant approval for the business and confirm AUD acceptance/settlement with PayHere. Register the final domain and obtain its domain-specific Merchant Secret.
2. Set `PAYHERE_MERCHANT_ID` and `PAYHERE_MERCHANT_SECRET` as server-only Vercel Secrets. Never prefix either with `NEXT_PUBLIC_`.
3. Use `PAYHERE_MODE=sandbox`, `PAYHERE_ENABLED=true` with sandbox credentials first. Publish accurate shipping, returns, privacy and terms policies, confirm inventory/prices, then enable Accept new orders in admin Settings.
4. Test success, cancelled, declined, pending and repeated callbacks against the real public callback URL `/api/payhere/notify`. Check actual orders and stock. No real payment requests were made during development tests.
5. After successful testing, switch to approved live credentials and `PAYHERE_MODE=live`, redeploy and perform an authorized merchant test.

The browser submits a server-generated signed form to PayHere. Amounts/stock are computed on the server. Payment confirmation requires a verified merchant signature, order amount and AUD currency match. Browser return URLs cannot mark an order paid. Duplicate notifications do not reserve stock again; late success after expiry is flagged for merchant review. Gateway payment states cannot be edited by an admin form. Refunds/chargebacks must be handled in the merchant dashboard; this integration does not initiate refunds.

Unpaid reservations expire after 30 minutes. Each new checkout releases expired reservations. For timely cleanup during quiet periods, configure a random `CRON_SECRET` and schedule authenticated GET requests to `/api/cron/expire-orders` every 15 minutes using the chosen hosting scheduler. Automatic cron scheduling is intentionally not enabled before live payments.

## Domain

`bindyclothing.com.au` and `www.bindyclothing.com.au` are attached to the project. www redirects permanently (308) to the apex. Keep Crazy Domains nameservers and any existing email records. Vercel's verified recommendations on 2026-10-28:

| Type | Host | Value |
|---|---|---|
| A | @ | 216.150.1.1 |
| A | @ | 216.150.16.1 |
| CNAME | www | f45df69e05472938.vercel-dns-017.com. |

The old apex/www A record was `27.124.125.171`, TTL 300. Replace only the web records after the new production deployment is ready. Preserve MX/TXT/SPF/DKIM records. Re-run `vercel domains verify bindyclothing.com.au --json` and the www equivalent, then check HTTPS before declaring the custom domain live.

## Validation

`npm run build`, `npm run test:security` (30 checks), `node scripts/check-performance.cjs` (18 checks), product/cart consolidation checks and five production HTTP/photo checks passed. A real Supabase transaction also verified private table/function access, CAS conflicts and restrictive media-write policies; it was rolled back without leaving test data. `npm audit` reported zero vulnerabilities after patching. These checks do not replace a live PayHere merchant/sandbox checkout test.

## Vercel agent setup

Official CLI installed globally (65.5.0), authenticated and linked to the existing project. The official Vercel plugin was installed in user scope; no standalone duplicate skill pack was installed. Shared MCP endpoint `https://mcp.vercel.com` was added to user Codex configuration and OAuth completed. The current chat must reload its tools before MCP `search_vercel_documentation` and authenticated `list_teams` can be verified. Keep human approval for MCP mutations.
