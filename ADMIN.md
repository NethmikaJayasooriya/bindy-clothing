# BINDY Store Admin

Open `/admin`. The former Seller Hub has been replaced; its public footer links and mock seller/artisan/payout data are removed. The storefront still uses the existing branding and product photography.

## Start locally

```powershell
npm run dev -- -p 3001
```

Open http://localhost:3001/admin and create your own owner account. No default production password is installed. Passwords require 12–128 characters and are hashed with scrypt. Login sessions expire after 12 hours. Customer browser accounts do not grant admin access.

The initial catalogue imports the current 33 products and their existing images. **Verify the imported starting stock against actual inventory**, shipping prices, contact details and policies before taking live orders. Privacy and terms pages start as drafts for owner review.

## Workspace

- **Overview:** actual paid sales, recent orders, stock alerts and activity. New stores begin with zero orders and sales.
- **Products:** create/edit products, categories, prices, cost, compare-at price, SKU, images, sizes, stock, craft/care and stories. Draft/archive products without deleting order history. Feature products at the top of the collection. Search, filter, bulk update and CSV export.
- **Inventory:** quantities per size, low-stock views and stock adjustment. Checkout validates and reserves inventory on the server.
- **Orders:** website and manually created orders, customer addresses, payment records, packing, carrier/tracking, delivery status, cancellation and printable packing slips. Cancellation returns stock exactly once. Dispatched orders use the returns workflow.
- **Customers:** contact details, order history, internal notes and CSV export.
- **Inbox:** contact form enquiries, internal notes, resolution status and an email reply link. Newsletter contacts require explicit signup consent and can be exported or unsubscribed.
- **Discounts:** percentage, fixed amount or free shipping, minimum spend, start/end dates, usage limit and activation. WELCOME10 is the initial welcome code.
- **Returns:** customer requests from `/returns/start`, manual requests, resolution notes, recorded refund amount and full-order restocking. The restock option returns **all items in that order**; partial return quantities need manual inventory adjustment. Refunds must be processed separately with the payment provider.
- **Store content:** hero images, headlines, captions, links, order, visibility and mobile/desktop focal points. Shipping, returns, privacy and terms pages support draft/publish.
- **Media:** existing product/campaign photos and JPG/PNG/WebP uploads up to 8 MB. No SVG or executable uploads.
- **Reports:** actual saved order data for 7/30/90 days with CSV export. The sales chart shows the latest 7/14 days and labels this explicitly.
- **Settings:** contact details, announcement, shipping fees, free-shipping threshold, return window, order prefix, order intake, backup download and password change.

Listings refresh on navigation, on focus and every 30 seconds while idle. Editing dialogs and the content/settings forms are not refreshed underneath the user. Use the refresh icon when you want an immediate update. Stale conflicting writes return a conflict instead of overwriting newer data. The storefront refreshes its public catalogue on focus and every minute; fresh page requests use current data.

## Payments and messages

No payment gateway or email delivery provider was configured by this change. Checkout saves real orders as **unpaid**, collects no card details and tells the customer that payment will be arranged after confirmation. Admin payment/refund fields are bookkeeping records; changing a status does not charge or refund a card. Contact enquiries and newsletter signups are saved locally on the store server; no automatic email is sent. The reply link opens the owner's email client.

Virtual Style Studio previews are not separate inventory SKUs. Sell individual garments by creating separate top/bottom catalogue products with their own stock and price; do not treat a generated split preview ID as a new stocked item.

## Data and deployment

This implementation uses a serialized, atomic file repository for a **single Node.js server process with persistent storage**. It is functional locally but is not a shared cloud database.

- `.store/store.json`: catalogue, orders, customers, policies, settings, enquiries and subscribers.
- `.store/owner.json`: owner password hash and hashed session records. Never expose or commit it.
- `public/uploads/`: uploaded media. Keep it on persistent storage as well as the data directory.
- `BINDY_DATA_DIR`: optional absolute path to an alternative persistent data directory.
- `ADMIN_SETUP_TOKEN`: required for the first owner setup in production. Set a strong secret through the host environment; enter it on the first-run setup screen. Setup is disabled once an owner exists.

Before deployment, configure HTTPS, persistent storage, the production setup token and appropriate backups. Ephemeral serverless filesystems or several Node workers/instances require replacing this repository with a shared database/object storage. Admin cookies are Secure in production, HttpOnly and SameSite=Strict. Mutations require a matching Origin header; configure reverse proxies so the original store origin is preserved.

The Settings backup downloads store data only, not credentials or photo files. Keep encrypted/offline copies of the data directory and uploads when deploying. There is no automatic email password-reset service; owner recovery needs assistance from the server administrator.

## Verification

```powershell
npx tsc --noEmit
$env:NEXT_BUILD_DIR='.next-admin-check'; npm run build
```

An isolated integration suite is at `scripts/check-admin.cjs`. Run a second development server on port 3002 with `BINDY_DATA_DIR` set to `<project>/.store-qa` and `NEXT_BUILD_DIR=.next-admin-qa`, then run `node scripts/check-admin.cjs`. It creates test-only owner/customer/order data in that separate directory and tests authentication, origin checks, updates, inventory, idempotency, discounts, returns, inbox, consent and backups. Do not point this suite at the live store. Test credentials are only for `.store-qa`; the actual store owner chooses their own password.
