# Fitting room

The old two-stage FASHN previews could alter the top while applying the bottom.
The v3 service sends the fixed model and **both garment references together** to
`bria/fibo-edit-1.5/virtual-try-on`. All 13 tops and 13 bottoms use reviewed private
reference crops in `data/tryon-references`; these are not storefront images.
An admin product-photo change bypasses the old curated reference automatically.

## Runtime and limits

- `FAL_KEY` stays in the server environment. It is never returned to the browser.
- Store content → Fitting room controls automatic generation, a lifetime attempt
  limit and a daily attempt limit. The default for an unconfigured store is paused.
- Controls/jobs live in service-only `public.bindy_documents`, with `tryon:` keys.
  They do not modify the store, customer or order documents.
- A database compare-and-swap claims one job and reserves one attempt before
  submitting to the FAL queue. Identical requests reuse it. A timeout during
  submission is not automatically resubmitted because it might already be billed.
- The browser polls our API. It never contacts FAL directly. Short-lived service
  download URLs stay on the server. Completed images are decoded and saved in
  `bindy-media/tryon/outfit-v3-bria-5555` before becoming ready.
- A temporary download/storage failure retries the same paid result. A corrupt
  result is rejected. Explicit retry after one minute may use another attempt.
- The total limit is an application spending control, **not** the FAL balance.
  The verified account API price on 2026-10-31 was USD 0.04 per output image.
  Check current FAL pricing/balance before increasing limits; service failures may
  still be charged. No automatic top-up is configured by this application.

## Cache correctness

Cache identity includes engine/version, seed, both piece IDs/names, catalogue
photos, reference-file content, extra instructions and model content. Legacy
`/images/tryon/*.jpg` files are never used by v3. Four manually reviewed prepared
combinations are listed in `data/tryon-prepared.json`, with SHA-256 integrity
checks; these remain free to view with generation paused. New results are saved
once and reused by every visitor.

The client immediately hides the old outfit on a new selection, aborts obsolete
lookups, verifies returned piece IDs, and waits for full image decode before
displaying it. Unavailable previews show the two selected garments separately,
never another outfit presented as a fitting result. Compatibility suggestions
are not displayed as accuracy percentages.

These are AI styling previews, not exact fit predictions. Fine details, drape,
pose and proportions may vary. Product photos and size guides remain definitive.
Each new catalogue garment needs a clear, complete garment photograph; a hidden
hem or obscured print cannot be recovered reliably from a reference image.

## Checks

`node scripts/check-tryon.cjs` tests cache invalidation, current catalogue lookup,
corrupt/truncated images, durable publication, concurrent requests, total limits,
paused generation, and retrying storage without another paid render.
`node scripts/check-tryon-selection.cjs` tests immediate stale-preview removal,
out-of-order responses, obsolete-request cancellation and image decode failures.
These checks make no paid calls. Use a separate `NEXT_BUILD_DIR` and local
`BINDY_DATA_DIR` for production-build HTTP checks. Do not enable paid generation
just for automated browser/HTTP tests.

References: https://fal.ai/models/bria/fibo-edit-1.5/virtual-try-on/api and
https://fal.ai/docs/platform-apis/v1/models/pricing .
