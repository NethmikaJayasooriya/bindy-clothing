# Storefront media and interaction performance

## Changes

- Retired all 17 legacy product reference URLs from the seeded catalogue. Their originals are preserved in `assets/retired-reference-photos/`, outside the public website. Model photography replaces mannequin/room-reference views.
- Saved store products, review photos and order thumbnails pass through the same media normalization, keeping gallery/zoom/caption indexes aligned. Old cart image URLs also resolve through the replacement map. No products, stock, prices, orders or customer records were deleted.
- Generated responsive WebP derivatives for 238 referenced images, including 160px thumbnails and larger gallery/zoom variants. Original model photos remain intact. The 960px derivative totals are 22.9 MB versus 74.0 MB for their source files (69% less); this is an asset comparison, not a claim about a single page's transfer size.
- Native image views use responsive `srcset`, appropriate sizes, asynchronous decoding and lazy loading. The active hero/product image loads eagerly. Hero slides warm progressively after the first photograph loads, and card video metadata no longer downloads upfront.
- Content-addressed derivative URLs have immutable one-year caching. Changing the source photo produces a new URL.
- The intro uses transform/opacity animation and finishes within 1.95 seconds. It is claimed before playback and skipped on back navigation/reload in the same tab. A memory guard handles blocked storage; reduced-motion users skip it.
- Product links warm on pointer/keyboard intent and have a route loading view and immediate progress feedback. Gallery arrows no longer wait through sequential fade animations. Add to Bag opens the cart immediately rather than after a 450ms delay. Hidden card actions cannot intercept mobile taps.
- Below-the-fold homepage features mount near the viewport; the catalogue grid avoids layout-measuring list animations. The navbar uses an intersection observer rather than measuring its hero on every scroll, and nonessential fonts are no longer preloaded.

## Verify / regenerate

```powershell
python scripts/optimize-images.py
node scripts/check-performance.cjs
node output/review/check-product-consolidation.cjs
$env:NEXT_BUILD_DIR='.next-performance'; npm run build
$env:NEXT_BUILD_DIR='.next-performance'; npm run start -- -p 3001
node scripts/check-production-performance.cjs
```

The optimizer preserves source images, reuses already generated files, and writes `data/image-manifest.json`. Run it after adding/replacing local photos; newly uploaded/external photos retain a working lazy-loaded fallback until variants are generated.

## Validation

- 18 media/session regression checks passed.
- Existing catalogue/cart/buy-now/wishlist consolidation checks passed.
- Production build and type checking passed.
- Five read-only production HTTP checks passed, including sanitized public data, rendered responsive images, immutable asset caching and a 404 for the retired mannequin photo.
- Local warm product HTTP responses were 59 / 44 / 61 ms. These measurements exclude real-world network/device conditions and are not a full browser performance score.
- Browser checks covered desktop and 390px mobile-width product navigation, next gallery image, Add to Bag, cart cleanup, back navigation and reload. The splash count after back/reload was zero. The Gingham gallery has only its two model photos.

Audit output and screenshots are in `output/performance/`.
