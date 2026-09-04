/**
 * BINDY Clothing — FAQ Data Layer
 * Categorized frequently asked questions for customers.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export const FAQ_DATA: FaqCategory[] = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "What are your shipping rates and delivery timeframes in Australia?",
        a: "We offer complimentary express carbon-neutral shipping across Australia on all orders over $150 AUD. For orders under $150, a flat rate of $10 AUD applies. Orders dispatched from our Brisbane fulfillment studio arrive in 2 to 4 business days for metro areas.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide with DHL Express. International shipping is calculated at checkout based on your country. Orders to New Zealand, the United States, and the United Kingdom typically arrive within 4 to 7 business days.",
      },
      {
        q: "How will my order be packaged?",
        a: "Every BINDY piece arrives wrapped in unbleached tissue paper and tucked inside an organic cotton drawstring garment bag that you can reuse for travel. All mailers are 100% home-compostable and plastic-free.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    items: [
      {
        q: "How do BINDY garments fit compared to standard Australian sizing?",
        a: "Our silhouettes are designed to be true to Australian standard sizing (AU 6 through 14). Most styles feature gentle ease through the hips and waist for breathability. Check our dedicated Size Guide for precise bust, waist, and hip measurements.",
      },
      {
        q: "What if I am between sizes?",
        a: "For structured bodice pieces like the Lotus Memory Dress, we recommend sizing to your bust measurement. For relaxed tiered dresses and elasticated skirts, you can comfortably take your smaller size for a closer fit or larger size for a relaxed drape.",
      },
      {
        q: "Do you offer custom tailoring or extended sizing?",
        a: "Because our pieces are handloom woven in small artisan batches of 25 to 50, sizes AU 6–14 are our current standard run. We are actively working with our weaver cooperatives to expand into AU 16 and 18 for upcoming collections.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer 30-day hassle-free returns and exchanges on all unworn, unwashed pieces with original seed-paper tags attached. We want you to feel complete calm and certainty with every piece you welcome into your wardrobe.",
      },
      {
        q: "How do I initiate an exchange for a different size?",
        a: "Simply email care@bindyclothing.com with your order number. If your desired size is in stock, we will reserve it for you immediately and provide a prepaid return shipping label.",
      },
    ],
  },
  {
    category: "Fabric Care & Craft",
    items: [
      {
        q: "How should I wash and care for handloom cotton garments?",
        a: "Treat your handloom pieces with gentle care: hand wash or machine wash on a cold, delicate cycle with mild eco-friendly liquid detergent. Line dry in the shade to protect natural dye vibrancy. Iron with warm steam on the reverse side.",
      },
      {
        q: "Are the mother-of-pearl and coconut buttons safe to wash?",
        a: "Yes, our organic shell and coconut buttons are completely water-safe and durable. We recommend turning your garment inside out or placing it inside a mesh laundry bag during machine washing to protect against drum friction.",
      },
    ],
  },
];
