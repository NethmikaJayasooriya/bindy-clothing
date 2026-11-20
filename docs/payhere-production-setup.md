# Bindy PayHere production setup

The existing server-side Checkout API integration uses Merchant ID `264454`.
Australian standard and express delivery are both **AUD 28 per order**, including
orders above the old free-shipping threshold. Sri Lanka COD delivery is unchanged.

Production environment variables in the `bindy-clothing` Vercel project:

| Name | Value | Type |
| --- | --- | --- |
| `PAYHERE_MERCHANT_ID` | `264454` | Config |
| `PAYHERE_MODE` | `live` | Config |
| `PAYHERE_ENABLED` | `true` | Config |
| `SITE_URL` | `https://bindyclothing.com.au` | Config |
| `PAYHERE_MERCHANT_SECRET` | Owner must add the domain-specific Merchant Secret | **Secret** |

The missing Merchant Secret keeps online payments unavailable. No placeholder
secret is stored. Production credentials are not copied to Preview or Development.

## Owner's remaining step

1. In PayHere, open **Integrations** and obtain the **Merchant Secret for
   `bindyclothing.com.au`**. This is not an App Secret for the merchant APIs.
   If necessary, add the domain and wait for PayHere's approval.
2. Open [Bindy's Vercel environment settings](https://vercel.com/nethmika-gimhanas-projects/bindy-clothing/settings/environment-variables).
3. Add `PAYHERE_MERCHANT_SECRET`, paste its value, select **Production** and
   **Secret**, then save. Keep this value out of chats and source files.
4. **Redeploy** the production project so the server receives the new variable.
   The existing enabled/live configuration is already prepared.

Payment notification URL: `https://bindyclothing.com.au/api/payhere/notify`.
The server verifies callback signatures, merchant, currency and order amount;
return-page navigation alone never marks an order as paid.

No live payment has been made or verified as part of setup. A domain-approved
Merchant Secret and PayHere account approval are still required to take payments.

References: [PayHere Checkout API](https://support.payhere.lk/api-%26-mobile-sdk/checkout-api),
[Vercel Secret/Config types](https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types),
[Vercel environment changes and redeploys](https://vercel.com/docs/environment-variables/managing-environment-variables).
