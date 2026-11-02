# Search & measurement launch

Production: https://bindyclothing.com.au

## Implemented

- Server-rendered route titles, descriptions, canonical URLs, social previews and index controls. Invalid categories, regional guides and withdrawn product URLs return HTTP 404 before streaming; the known product alias redirects permanently. Other dynamically missing products use Next.js notFound/noindex (a streamed response can carry HTTP 200).
- Sitemap includes active products, image URLs, all four categories, client-care pages and the Australia/Sri Lanka guides. Retired products stay excluded. The www host redirects to the apex; Vercel aliases and private flows carry noindex headers.
- Organization, WebSite, BreadcrumbList, CollectionPage/ItemList and basic Product JSON-LD. No seeded ratings, addresses, certification claims or mock prices. Merchant Offers are enabled only when AUD ordering and a live payment gateway are actually enabled. Until then, Google merchant-rich-result eligibility is intentionally incomplete.
- Reciprocal en-AU/en-LK/x-default annotations apply only to the actual regional shopping-guide family. No nonexistent translations, forced regional redirects, city keyword pages or special AI text files.
- Visible shopping answers explain outfit contents, sizing, currencies, current demo COD, returns and AI-preview limitations. Footer links make these guides crawlable.
- Admin → Store settings → Search & analytics accepts the public GA4 measurement ID and optional URL-prefix Search Console HTML token. Normal settings saves cannot overwrite these fields.
- Optional Google Analytics uses basic opt-in consent, production apex only, denied ad permissions and no Google Signals. Cookie preferences can withdraw consent and clear GA cookies. No tag is loaded before consent. Query strings, fragments and raw external-referrer URLs are omitted; private checkout/account/admin/payment pages are excluded.
- Manual page_view, view_item, add_to_cart, view_cart and begin_checkout catalogue events. Enhanced measurement must be OFF in the Google stream to avoid duplicate/automatic URL/form collection. Consent-denied visits are intentionally absent from GA4.
- No purchase event is sent while the store uses demo COD and an unapproved gateway. Real purchase measurement must be connected to validated live receipts when real payments/orders launch; TEST-BIN orders must never become revenue. Catalogue funnel values are AUD; demo LKR is not a sales currency.

## Google setup checklist

1. Use the user's selected, currently signed-in Google account. Check existing properties/streams first; avoid duplicate Google assets.
2. Prefer Search Console Domain property for bindyclothing.com.au. Add only Google's actual TXT verification value to DNS, preserving mail/other records. Alternatively verify the HTTPS URL-prefix property with the exact HTML content token in the admin setting. Do not remove verification after setup.
3. Submit https://bindyclothing.com.au/sitemap.xml. Inspect the homepage, a category, a product and each regional guide. A sitemap submission is not an indexing/ranking guarantee.
4. GA4 property: BINDY Clothing, Australia reporting timezone and AUD currency. Track Sri Lankan geographic visits in the same property, with the region-guide page paths; no mock LKR revenue. Create a Web stream for the canonical HTTPS domain. Keep enhanced measurement OFF, Google Signals OFF and advertising integrations OFF. Avoid enabling optional data-sharing features.
5. Save its actual G- measurement ID in the store's tracking settings. Check consent denied/allowed/withdrawn, route changes, query stripping and no duplicate page views in Realtime/DebugView. Do not generate a fake purchase to test reports.
6. Review Search Console coverage, query/country impressions and Core Web Vitals after Google processes data. Review GA4 Acquisition and country reports. Search performance develops over time; no first-place or AI citation guarantee is possible.

## Before live commerce

Confirm real product specifications, SKU/brand information, final LKR prices, delivery fees, tax handling, returns, domain ownership, approved payment provider and owner-reviewed policies. Disable COD demo only after these checks. Do not invent GTINs or customer reviews. Add legitimate transaction-level analytics only after that transition.

## References

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://support.google.com/webmasters/answer/9008080
- https://support.google.com/analytics/answer/14009635
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

## Verification

13 SEO/consent checks, 30 security/payment checks and 17 COD checks passed. The local production crawl checked 16 routes, 49 sitemap URLs, private noindex headers, filtered collections, retired product 404s, category/region 404s and the permanent alias redirect. Mobile guide layout and cookie-preferences controls were checked at 390px.

Run `node scripts/check-seo.cjs`, `npm run test:security`, `node scripts/check-cod.cjs`, TypeScript and an isolated production build. Check generated HTML/headers/sitemap against the local production server, then the deployed canonical host. Google account verification and actual measurement IDs are recorded separately only after the UI confirms them.
