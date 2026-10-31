import type { ContentPage, StoreSettings } from "@/lib/store-types";

export const RETURNS_CONSUMER_RIGHTS = "## Your consumer rights\n\nChange-of-mind return conditions do not limit your rights under the Australian Consumer Law. If an item is faulty, misdescribed or otherwise fails to meet a consumer guarantee, contact us to discuss the remedy required by law. A voluntary return window or requirement for unworn items does not remove those rights.";

// Published copy remains editable in Store content > Store policies.
// Tokens keep contact details aligned with owner-managed store settings.
export const DEFAULT_POLICY_PAGES: ContentPage[] = [
  {
    slug: "privacy", title: "Privacy Policy", published: true,
    body: `Last updated: 1 November 2026

## About this policy

{{storeName}} operates bindyclothing.com.au. This policy explains how we handle personal information when you browse, contact us, save your preferences or shop with us. Contact us at {{email}} or {{phone}} with privacy enquiries.

## Information we collect

We collect the information you choose to provide, such as your name, email address, phone number, delivery address, selected garments and sizes, order information, return requests and messages to our team. If you subscribe to store updates, we collect your email address and subscription preference.

Our hosting and security services process technical information such as IP addresses, browser or device information, request times and error records to deliver and protect the website. Please do not include passwords, payment-card details or sensitive personal information in enquiry messages.

## How we use information

We use information to respond to enquiries, process and fulfil orders when checkout is available, arrange delivery, manage returns, maintain transaction records and protect the store from fraud or misuse. We use subscription details for store updates where you have chosen to receive them. We do not sell customer personal information.

You can browse the collection without providing your name. We need sufficient contact and delivery information to answer a personal enquiry or fulfil an order; without it, we may be unable to provide that service.

## Browser storage and cookies

The website uses local storage to remember your bag, saved items and any profile, address or style preferences you choose to save on your device. Session storage supports features such as the welcome animation and buy-now selection. Store-management sign-in uses a session cookie. You can clear these through your browser settings; doing so may remove saved items and preferences or sign you out. Avoid saving personal details on a shared device.

## Service providers and overseas processing

We share information needed to operate the store with authorised team members and relevant service providers, such as website hosting, database storage, delivery and payment services. Our website uses Vercel hosting and Supabase database services. Store operations and these services can involve processing in Australia, Sri Lanka, Singapore and the United States. A delivery or payment provider may process information in other countries under its own privacy policy. You can contact us to ask about a particular service or disclosure.

We may disclose information where required by law or reasonably necessary to investigate fraud, protect legal rights or respond to a lawful request. We seek to limit disclosures to information needed for the relevant purpose.

## Payments and virtual outfit previews

When online payments are available, payment-card details are entered with the payment provider rather than stored by this website. We retain the order and payment-reference information needed to manage the purchase. The enabled provider and payment options are shown at checkout; an unavailable checkout does not accept payment.

Virtual outfit previews use catalogue garment photographs and a fixed studio-model image with an external image-generation service. This feature does not request a customer's own photograph. A selected outfit is an AI styling illustration, not a measurement or assessment of your body.

## Storage, security and retention

We use HTTPS, restricted store-management access and service access controls to help protect information. No internet service can guarantee absolute security. We retain information for as long as reasonably needed for the purpose collected, order support, fraud prevention and applicable legal or accounting obligations. We review information for deletion or de-identification when it is no longer needed. Information you save in your browser remains there until it is cleared or removed.

## Your choices, access and correction

Contact {{email}} to ask what personal information we hold about you, request access or correction, withdraw a subscription or ask for information to be deleted. We may need to verify your identity before responding. Some records may need to be retained to complete an order or meet a legal obligation; we will explain any applicable restriction. Your browser settings let you remove information saved locally on your device.

## Privacy concerns and changes

Send a privacy complaint to {{email}}, describing the issue and how we can contact you. We will acknowledge it, investigate and respond as reasonably practicable. If you remain dissatisfied, you can contact the Office of the Australian Information Commissioner where the matter falls within its jurisdiction: https://www.oaic.gov.au/privacy/privacy-complaints

We may update this policy as our services or information-handling practices change. The date above identifies this version.`,
  },
  {
    slug: "terms", title: "Terms & Conditions", published: true,
    body: `Last updated: 1 November 2026

## Shopping with BINDY

These terms apply to use of bindyclothing.com.au and purchases from {{storeName}}. Please read them together with our Privacy Policy, Shipping & Delivery policy, and Returns & Exchanges policy. For help, contact {{email}} or {{phone}}. If you place an order for someone else, you must have permission to provide their information and use the selected payment method.

## Products and availability

Product pages describe the garments offered, including prices, sizes and available stock. Please check the size guide and garment details before ordering. Colours can vary between displays, and product photography may show other items used for styling. Unless expressly included, accessories and other garments in an outfit photograph are not part of the product being purchased.

Separate garments and full sets are identified on their product pages. A styling preview does not create a separately purchasable item or change the contents of a listed set. The items and prices in your order summary determine what you are buying.

## Prices and promotions

Store prices are displayed in Australian dollars (AUD). The order summary shows the product price, applicable delivery charges, discounts and any separately applicable tax before you confirm payment. Promotional codes are subject to their displayed conditions and availability; a saved bag does not reserve stock or lock in a promotional price.

If we identify a material pricing, description or availability error affecting an order, we will contact you to explain the issue and offer an appropriate correction or cancellation. We will not substitute a different product or increase an agreed order charge without your agreement. Any payment for an order we cannot fulfil will be refunded.

## Orders and payment

Checkout is available only when ordering and the payment service are enabled. Please supply accurate contact and delivery information and review the order summary before paying. A submission or payment reference alone is not a promise that unavailable stock can be supplied. We confirm order acceptance and fulfilment using the contact details provided.

Use only a payment method you are authorised to use. Online card payments, when enabled, are processed through the provider identified at checkout. Do not email or message payment-card details to us. If payment fails or an unpaid reservation expires, the order may not proceed. Contact us promptly if your payment and order status appear inconsistent.

## Delivery

Available delivery destinations, charges and options are shown in our shipping information and at checkout. Delivery estimates are estimates, not guaranteed dates unless expressly agreed. Please contact us promptly about an incorrect address, a missing parcel or damage in transit so we can investigate. These terms do not remove any responsibility or remedy that applies under consumer law.

## Returns and Australian consumer rights

Our goods come with consumer guarantees that cannot be excluded under the Australian Consumer Law. If a product fails to meet a consumer guarantee, you are entitled to the remedy required by law. For a major failure, this can include choosing a refund or replacement; other remedies and compensation may also apply depending on the circumstances.

Our voluntary change-of-mind return conditions, including any time window or requirements about tags and unworn items, do not limit your rights for faulty, misdescribed or otherwise non-compliant goods. Please contact {{email}} or use the return-request page to discuss a problem. Further information about consumer guarantees is available at https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees

## Style Studio and website content

Style Studio provides AI-generated outfit illustrations using selected garment references. Previews may differ in drape, proportions, colour or fine detail and are not exact fit predictions. Product photographs, descriptions and size guides should inform your purchase. A styling suggestion does not change the garments, quantity or price shown in the order summary.

BINDY branding, website copy and imagery may be protected by intellectual-property rights belonging to us or the relevant rights holders. You may browse and share links for personal use. Please obtain permission before reproducing protected content for commercial use.

## Responsible use

Do not misuse the store, attempt unauthorised access, interfere with its operation, submit fraudulent orders or use automated requests to exhaust services. We may restrict activity reasonably necessary to protect the store and its customers. Where an accepted order is affected, we will address fulfilment or refund obligations as required by law.

## Changes, responsibility and contact

We may update these terms for future use of the website and future purchases. A later version does not retrospectively remove rights relating to an earlier purchase. Nothing in these terms excludes or restricts rights, guarantees or remedies that cannot lawfully be excluded. Australian consumer protections apply where required by law, including to eligible Australian purchases supplied from overseas.

For an order, website or policy question, contact {{email}} or {{phone}}.`,
  },
  {
    slug: "security", title: "Security Policy", published: true,
    body: `Last updated: 1 November 2026

## Our approach

{{storeName}} uses technical and operational measures to help protect this website and the information used to run the store. These include HTTPS connections, restricted store-management access, server-side checks and controls intended to limit abusive requests. Security is an ongoing process; no website can promise that every risk will be prevented.

## Payments and personal information

When checkout is enabled, payment-card details are handled by the payment provider identified at checkout. This website does not store full payment-card details. We will not ask you to send your password, full card number, security code or one-time banking code by email or an enquiry message. Our Privacy Policy explains how customer and order information is handled.

## Protecting your device and details

Check that you are using https://bindyclothing.com.au before providing information. Keep your browser and device up to date, and be cautious about unexpected messages asking you to pay or reveal credentials. Saved bag, address and profile details may remain in your browser's local storage; clear them when using a shared device. If a payment request appears suspicious, contact us using the details on this website before acting on it.

## Report a security concern

Email {{email}} with the subject “Website security concern”. Include the affected page, what you observed, the approximate time and any minimal steps needed to reproduce the issue. Please remove customer data, passwords, access tokens and payment details from screenshots or attachments. If you discover someone else's information, stop accessing it and contact us promptly.

Please report issues privately. Do not access other people's data, change or delete information, interrupt services, run high-volume scans or demand payment as a condition of reporting. This page does not authorise testing beyond what is permitted by law, and it does not offer a paid bounty.

## How we respond

We review reported concerns, investigate and take action appropriate to the issue. Where a personal-information incident triggers a legal notification obligation, we will follow the applicable requirements. We may need further details to investigate and cannot guarantee a specific resolution date or a particular outcome. For urgent order or suspected-payment concerns, contact {{email}} or {{phone}}.`,
  },
];

export function resolvePolicyContact(body: string, settings: Pick<StoreSettings, "storeName" | "email" | "phone">) {
  return body.replace(/\{\{(storeName|email|phone)\}\}/g, (_, key: keyof typeof settings) => settings[key]);
}

export function policyBlocks(body: string) {
  return body.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean).map((text, index) => ({
    text: text.startsWith("## ") ? text.slice(3) : text,
    heading: text.startsWith("## "),
    id: `section-${index}`,
  }));
}
