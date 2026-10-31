# Storefront media and interaction performance

## Changes

- Retired all 17 legacy product reference URLs from the seeded catalogue. Their originals are preserved in `assets/retired-reference-photos/`, outside the public website. Model photography replaces mannequin/room-reference views.
- Saved store products, review photos and order thumbnails pass through the same media normalization, keeping gallery/zoom/caption indexes aligned. Old cart image URLs also resolve through the replacement map. No products, stock, prices, orders or customer records were deleted.
- Generated responsive WebP derivatives for 238 referenced images, including 160px thumbnails and larger gallery/zoom variants. Original model photos remain intact. The 960px derivative totals are 22.9 MB versus 74.0 MB for their source files (69% less); this is an asset comparison, not a claim about a single page's transfer size.
- Native image views use responsive `srcset`, appropriate sizes, asynchronous decoding and lazy loading. The active hero/product image loads eagerly. Hero slides warm progressively after the first photograph loads, and card video metadata no longer downloads upfront.
- Campaign hero photos now have dedicated quality-90 WebP variants exported directly from the 4000 × 2252 client originals. Portrait phone crops preserve the full original height and focal point; landscape/desktop views retain the complete photograph. Cover-aware `sizes` accounts for image height and the opening slide's 70% phone height, preventing a small landscape variant from being stretched across a tall phone screen. CMS image/focal-point changes retain a full-image fallback.
- Content-addressed derivative URLs have immutable one-year caching. Changing the source photo produces a new URL.
- The intro uses transform/opacity animation and holds for 3 seconds after bounded asset/font readiness, then fades out over 600ms. It is claimed before playback and skipped on back navigation/reload in the same tab. A memory guard handles blocked storage; reduced-motion users skip it.
- Product links warm on pointer/keyboard intent and have a route loading view and immediate progress feedback. Gallery arrows no longer wait through sequential fade animations. Add to Bag opens the cart immediately rather than after a 450ms delay. Hidden card actions cannot intercept mobile taps.
- Below-the-fold homepage features mount near the viewport; the catalogue grid avoids layout-measuring list animations. The navbar uses an intersection observer rather than measuring its hero on every scroll, and nonessential fonts are no longer preloaded.

## Verify / regenerate

```powershell
python scripts/optimize-images.py
python scripts/prepare-hero-images.py
node scripts/check-performance.cjs
node scripts/check-hero-quality.cjs
node output/review/check-product-consolidation.cjs
$env:NEXT_BUILD_DIR='.next-performance'; npm run build
$env:NEXT_BUILD_DIR='.next-performance'; npm run start -- -p 3001
node scripts/check-production-performance.cjs
```

The optimizer preserves source images, reuses already generated files, and writes `data/image-manifest.json`. Run it after adding/replacing local photos; newly uploaded/external photos retain a working lazy-loaded fallback until variants are generated.

## Validation

- 18 media/session regression checks passed.
- 19 hero asset checks passed, including native resolution, no upscaling, existing variants, responsive crop bounds and a 450 KB ceiling for each 1080px phone crop.
- At a 390 × 844 browser viewport, the old garden hero selected a 640 × 360 landscape asset. The corrected version selected a 768 × 1024 portrait asset. All phone slides loaded their dedicated crops; a 1440 × 900 viewport selected the full landscape source. These are browser viewport checks, not tests on physical phones.
- Existing catalogue/cart/buy-now/wishlist consolidation checks passed.
- Production build and type checking passed.
- Five read-only production HTTP checks passed, including sanitized public data, rendered responsive images, immutable asset caching and a 404 for the retired mannequin photo.
- Local warm product HTTP responses were 59 / 44 / 61 ms. These measurements exclude real-world network/device conditions and are not a full browser performance score.
- Browser checks covered desktop and 390px mobile-width product navigation, next gallery image, Add to Bag, cart cleanup, back navigation and reload. The splash count after back/reload was zero. The Gingham gallery has only its two model photos.

Audit output and screenshots are in `output/performance/`.

- October 31 update: withdrew Moonflower Embroidered Halter Top and Rose Dot Button Corset Top from sale, including saved carts/wishlists and related-product references. Their historical order lines remain intact. The final two old hero slides were replaced by the supplied Blue, Coast and Highlands campaign photos, with full-height phone derivatives. The five chapter controls now share a responsive row.
