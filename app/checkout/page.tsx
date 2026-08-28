"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
  CreditCard,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Tag,
  Loader2,
} from "lucide-react";
import { getCart, clearCart, subscribe, type CartItem } from "@/lib/cart";

type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  method: "standard" | "express";
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  sameAsShipping: boolean;
}

interface CompletedOrder {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  shippingAddress: ShippingData;
}

const AUSTRALIAN_STATES = [
  { code: "QLD", name: "Queensland" },
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "SA", name: "South Australia" },
  { code: "WA", name: "Western Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
];

// Preserves Unicode, hyphens, apostrophes, and accented names while capitalizing words
const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
};

// Pure validation guards for step integrity
const isShippingComplete = (s: ShippingData): boolean => {
  return Boolean(
    s.firstName.trim() &&
    s.lastName.trim() &&
    s.email.trim() &&
    s.email.includes("@") &&
    s.phone.replace(/\D/g, "").length >= 8 &&
    s.address.trim() &&
    s.suburb.trim() &&
    s.postcode.trim().length >= 3
  );
};

const isPaymentComplete = (p: PaymentData): boolean => {
  const cleanCard = p.cardNumber.replace(/\s+/g, "");
  return Boolean(
    cleanCard.length >= 15 &&
    p.cardName.trim() &&
    p.expiry.includes("/") &&
    p.expiry.length >= 4 &&
    p.cvc.trim().length >= 3
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Form States
  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    suburb: "",
    state: "QLD",
    postcode: "",
    country: "Australia",
    method: "standard",
  });

  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
    sameAsShipping: true,
  });

  // Terms Consent Checkbox (Step 3)
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generated Order Details for Step 4
  const [orderSummary, setOrderSummary] = useState<CompletedOrder | null>(null);

  // Load and subscribe to cart + Rehydrate in-progress draft and completed order
  useEffect(() => {
    const currentCart = getCart();
    setItems(currentCart);

    if (typeof window !== "undefined") {
      try {
        // Check for completed order in this session first (Handles reload on confirmation & browser back/forward)
        const lastOrderRaw = sessionStorage.getItem("bindy_last_order");
        if (lastOrderRaw) {
          const parsedOrder = JSON.parse(lastOrderRaw) as CompletedOrder;
          if (parsedOrder && parsedOrder.orderId) {
            setOrderSummary(parsedOrder);
            setStep("confirmation");
            setIsLoaded(true);
            return;
          }
        }

        // Otherwise, rehydrate in-progress draft values
        const savedShippingRaw = sessionStorage.getItem("bindy_checkout_shipping");
        let initialShipping = shipping;
        if (savedShippingRaw) {
          const parsedShipping = JSON.parse(savedShippingRaw);
          initialShipping = { ...shipping, ...parsedShipping };
          setShipping(initialShipping);
        }

        const savedPaymentRaw = sessionStorage.getItem("bindy_checkout_payment");
        let initialPayment = payment;
        if (savedPaymentRaw) {
          const parsedPayment = JSON.parse(savedPaymentRaw);
          initialPayment = { ...payment, ...parsedPayment };
          setPayment(initialPayment);
        }

        // Validate step transition integrity
        const savedStep = sessionStorage.getItem("bindy_checkout_step") as CheckoutStep | null;
        if (savedStep === "review") {
          if (isShippingComplete(initialShipping) && isPaymentComplete(initialPayment)) {
            setStep("review");
          } else if (isShippingComplete(initialShipping)) {
            setStep("payment");
          } else {
            setStep("shipping");
          }
        } else if (savedStep === "payment") {
          if (isShippingComplete(initialShipping)) {
            setStep("payment");
          } else {
            setStep("shipping");
          }
        } else {
          setStep("shipping");
        }
      } catch {
        /* ignore parse errors */
      }
    }

    setIsLoaded(true);
    const unsubscribe = subscribe(() => {
      setItems(getCart());
    });
    return () => unsubscribe();
  }, []);

  // Sync draft values to sessionStorage as user types (unless on confirmation)
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && step !== "confirmation") {
      try {
        sessionStorage.setItem("bindy_checkout_shipping", JSON.stringify(shipping));
        sessionStorage.setItem("bindy_checkout_payment", JSON.stringify(payment));
        sessionStorage.setItem("bindy_checkout_step", step);
      } catch {
        /* ignore quota issues */
      }
    }
  }, [shipping, payment, step, isLoaded]);

  // Cart financial calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.product.priceAud * i.quantity, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const freeShippingThreshold = 250;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const shippingFee = useMemo(() => {
    if (shipping.method === "express") {
      return 18;
    }
    return isFreeShipping ? 0 : 12;
  }, [shipping.method, isFreeShipping]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((subtotal * appliedPromo.discountPercent) / 100);
  }, [subtotal, appliedPromo]);

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  // Input Formatting & Masking Handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setPayment((p) => ({ ...p, cardNumber: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setPayment((p) => ({ ...p, expiry: formatted }));
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPayment((p) => ({ ...p, cvc: raw }));
    if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: "" }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const hasPlus = val.startsWith("+");
    const digitsAndSpaces = val.replace(/[^\d\s]/g, "").slice(0, 18);
    const formatted = hasPlus ? `+${digitsAndSpaces.trimStart()}` : digitsAndSpaces;
    setShipping((s) => ({ ...s, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setShipping((s) => ({ ...s, postcode: raw }));
    if (errors.postcode) setErrors((prev) => ({ ...prev, postcode: "" }));
  };

  // Promo application
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = promoInput.trim().toUpperCase().slice(0, 20);
    if (!cleaned) {
      setPromoError("Please enter a discount code first");
      return;
    }

    if (cleaned === "BINDY20") {
      setAppliedPromo({ code: cleaned, discountPercent: 20 });
      setPromoInput("");
    } else {
      setAppliedPromo({ code: cleaned, discountPercent: 10 });
      setPromoInput("");
    }
  };

  // Step 1 Validation
  const validateShipping = (): boolean => {
    const errs: Record<string, string> = {};
    if (!shipping.firstName.trim()) errs.firstName = "Please enter your first name";
    if (!shipping.lastName.trim()) errs.lastName = "Please enter your last name";
    if (!shipping.email.trim() || !shipping.email.includes("@")) errs.email = "Please enter a valid email address";
    if (!shipping.phone.trim() || shipping.phone.replace(/\D/g, "").length < 8) {
      errs.phone = "Please enter a valid phone number (min 8 digits)";
    }
    if (!shipping.address.trim()) errs.address = "Please enter your street address";
    if (!shipping.suburb.trim()) errs.suburb = "Please enter your suburb or city";
    if (!shipping.postcode.trim() || shipping.postcode.length < 3) errs.postcode = "Please enter a 4-digit postcode";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validatePayment = (): boolean => {
    const errs: Record<string, string> = {};
    const cleanNum = payment.cardNumber.replace(/\s+/g, "");
    if (!cleanNum || cleanNum.length < 15) errs.cardNumber = "Please enter a valid 16-digit card number";
    if (!payment.cardName.trim()) errs.cardName = "Please enter the name on card";
    if (!payment.expiry.trim() || !payment.expiry.includes("/") || payment.expiry.length < 5) {
      errs.expiry = "MM/YY format required";
    }
    if (!payment.cvc.trim() || payment.cvc.length < 3) errs.cvc = "3 or 4-digit CVC required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setShipping((prev) => ({
        ...prev,
        firstName: toTitleCase(prev.firstName),
        lastName: toTitleCase(prev.lastName),
        address: toTitleCase(prev.address),
        apartment: prev.apartment ? toTitleCase(prev.apartment) : "",
        suburb: toTitleCase(prev.suburb),
        email: prev.email.trim().toLowerCase(),
        postcode: prev.postcode.trim(),
      }));
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setPayment((prev) => ({
        ...prev,
        cardName: toTitleCase(prev.cardName),
      }));
      setStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Step 3 -> 4 "Place Order" with double-submit synchronous guard
  const handlePlaceOrder = () => {
    if (!agreedToTerms || isSubmitting || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    setTimeout(() => {
      const mockId = `BDY-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const finalOrder: CompletedOrder = {
        orderId: mockId,
        orderDate: dateStr,
        items: [...items],
        subtotal,
        shippingFee,
        discountAmount,
        total,
        shippingAddress: { ...shipping },
      };

      setOrderSummary(finalOrder);

      // Store completed order separately in sessionStorage so refresh/back retains receipt
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("bindy_last_order", JSON.stringify(finalOrder));
          sessionStorage.removeItem("bindy_checkout_shipping");
          sessionStorage.removeItem("bindy_checkout_payment");
          sessionStorage.removeItem("bindy_checkout_step");
        } catch {
          /* ignore */
        }
      }

      // Clear the live bag
      clearCart();
      submittingRef.current = false;
      setIsSubmitting(false);
      setStep("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  // Safe Step Indicator navigation
  const handleStepClick = (target: "shipping" | "payment" | "review") => {
    if (step === "confirmation" || isSubmitting) return;

    if (target === "shipping") {
      setStep("shipping");
    } else if (target === "payment") {
      if (step === "review" || validateShipping()) {
        setStep("payment");
      }
    } else if (target === "review") {
      if (step === "review") return;
      if (validateShipping() && validatePayment()) {
        setStep("review");
      }
    }
  };

  // Clear completed order session when explicitly returning to shop
  const handleContinueShopping = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("bindy_last_order");
      } catch {
        /* ignore */
      }
    }
    router.push("/#collection");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ink-deep flex items-center justify-center text-paper">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs uppercase tracking-widest text-sand/70">Loading Checkout...</span>
        </div>
      </div>
    );
  }

  // If bag is empty and no completed order exists in this session
  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="min-h-screen bg-ink-deep text-paper flex flex-col justify-between">
        <header className="border-b border-white/10 py-5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-display text-2xl tracking-[0.12em]">
              BINDY<span className="text-gold">.</span>
            </Link>
          </div>
        </header>
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gold">
            <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
          </div>
          <h1 className="font-serif text-3xl font-light text-paper-light">Your Bag is Empty</h1>
          <p className="font-sans text-sm text-sand/80 leading-relaxed font-light">
            You don&apos;t have any pieces in your bag yet. Explore our Serendipity Collection 01 to begin your journey.
          </p>
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-medium hover:bg-cinnamon hover:text-white transition-all shadow-lg min-h-[48px]"
          >
            Discover Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <footer className="py-6 border-t border-white/10 text-center text-xs text-sand/60 font-sans">
          © {new Date().getFullYear()} BINDY Clothing • Brisbane, Australia
        </footer>
      </main>
    );
  }

  // Shared Order Items & Price Summary Content
  const renderSummaryContent = () => (
    <div className="space-y-6">
      {/* Items List */}
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
        {items.map((item, idx) => (
          <div key={`${item.product.id}-${item.size}-${idx}`} className="flex items-center gap-3 py-1.5">
            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full">
                ×{item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm text-paper-light truncate">
                {item.product.name}
              </h4>
              <p className="text-[11px] font-sans text-sand/70">
                {item.size} • {item.product.colorName}
              </p>
              <p className="font-serif text-xs font-medium text-gold mt-0.5">
                ${item.product.priceAud} AUD
              </p>
            </div>
            <span className="font-serif text-sm text-paper-light font-medium flex-shrink-0">
              ${item.product.priceAud * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="pt-4 border-t border-white/10 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-sand/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={25}
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                if (promoError) setPromoError("");
              }}
              placeholder="Discount code (e.g. WELCOME10)"
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-paper focus:outline-none focus:border-gold uppercase min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-sans uppercase tracking-wider text-paper hover:bg-gold hover:text-charcoal transition-colors min-h-[44px] cursor-pointer"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-[11px] text-terracotta font-sans flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {promoError}
          </p>
        )}
        {appliedPromo && (
          <div className="flex items-center justify-between text-xs text-sage bg-sage/10 border border-sage/30 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-1.5 min-w-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
              <span className="truncate">Code &lsquo;{appliedPromo.code}&rsquo; applied • {appliedPromo.discountPercent}% Off</span>
            </div>
            <button
              type="button"
              onClick={() => setAppliedPromo(null)}
              className="text-[10px] uppercase tracking-wider text-sand/60 hover:text-paper ml-2 flex-shrink-0 cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </form>

      {/* Price Breakdown */}
      <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs font-sans">
        <div className="flex justify-between text-sand/80">
          <span>Subtotal</span>
          <span>${subtotal} AUD</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-gold">
            <span>Promo Discount</span>
            <span>-${discountAmount} AUD</span>
          </div>
        )}

        <div className="flex justify-between text-sand/80">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-sage font-medium">FREE</span>
            ) : (
              `$${shippingFee} AUD`
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-baseline justify-between font-serif text-lg text-paper-light">
          <span>Total (AUD)</span>
          <span className="text-2xl font-bold text-gold">${total} AUD</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-ink-deep text-paper flex flex-col justify-between">
      {/* 1. LUXURY CHECKOUT HEADER */}
      <header className="sticky top-0 z-40 bg-ink-deep/90 backdrop-blur-xl border-b border-white/10 py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col leading-none flex-shrink-0">
            <span className="font-display text-2xl tracking-[0.12em] text-paper-light">
              BINDY<span className="text-gold">.</span>
            </span>
            <span className="text-[8px] font-sans uppercase tracking-[0.45em] text-gold mt-0.5">
              Clothing
            </span>
          </Link>

          {/* Centered Encryption Badge (hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-sans text-sand/70 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>256-Bit Encrypted Checkout</span>
          </div>

          {step !== "confirmation" ? (
            <Link
              href="/#collection"
              className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-sand/80 hover:text-gold transition-colors py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Return to Collection</span>
              <span className="sm:hidden">Back</span>
            </Link>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </header>

      {/* 2. CLICKABLE PROGRESS STEPPER (Steps 1–3) */}
      {step !== "confirmation" && (
        <div className="border-b border-white/10 bg-ink py-3.5 px-4 sm:px-6">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            {/* Step 1: Shipping */}
            <div
              className={`flex items-center gap-2 transition-colors py-1 ${
                step === "shipping"
                  ? "text-gold font-medium"
                  : step === "payment" || step === "review"
                  ? "text-paper-light hover:text-gold cursor-pointer"
                  : "text-sand/50"
              }`}
              onClick={() => handleStepClick("shipping")}
            >
              <span
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                  step === "shipping"
                    ? "bg-gold text-charcoal border-gold font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                    : step === "payment" || step === "review"
                    ? "bg-white/15 border-white/30 text-paper hover:border-gold hover:text-gold"
                    : "border-white/20 text-sand/50"
                }`}
              >
                {step === "payment" || step === "review" ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "1"}
              </span>
              <span className="text-xs uppercase font-sans tracking-wider hidden sm:inline">Shipping</span>
            </div>

            <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />

            {/* Step 2: Payment */}
            <div
              className={`flex items-center gap-2 transition-colors py-1 ${
                step === "payment"
                  ? "text-gold font-medium"
                  : step === "review"
                  ? "text-paper-light hover:text-gold cursor-pointer"
                  : "text-sand/50"
              }`}
              onClick={() => handleStepClick("payment")}
            >
              <span
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                  step === "payment"
                    ? "bg-gold text-charcoal border-gold font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                    : step === "review"
                    ? "bg-white/15 border-white/30 text-paper hover:border-gold hover:text-gold"
                    : "border-white/20 text-sand/50"
                }`}
              >
                {step === "review" ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "2"}
              </span>
              <span className="text-xs uppercase font-sans tracking-wider hidden sm:inline">Payment</span>
            </div>

            <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />

            {/* Step 3: Review */}
            <div
              className={`flex items-center gap-2 py-1 ${
                step === "review" ? "text-gold font-medium" : "text-sand/50"
              }`}
              onClick={() => handleStepClick("review")}
            >
              <span
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                  step === "review"
                    ? "bg-gold text-charcoal border-gold font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                    : "border-white/20 text-sand/50"
                }`}
              >
                3
              </span>
              <span className="text-xs uppercase font-sans tracking-wider hidden sm:inline">Review</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE COLLAPSIBLE ORDER SUMMARY ACCORDION (< lg) */}
      {step !== "confirmation" && (
        <div className="lg:hidden border-b border-white/10 bg-ink">
          <button
            type="button"
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-sans hover:bg-white/5 transition-colors cursor-pointer min-h-[48px]"
          >
            <div className="flex items-center gap-2 text-sand/90">
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span className="font-medium text-paper-light">
                {isMobileSummaryOpen ? "Hide order summary" : `Order summary (${totalItemsCount} items)`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gold transition-transform duration-300 ${
                  isMobileSummaryOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            <span className="font-serif text-sm font-bold text-gold">${total} AUD</span>
          </button>

          <AnimatePresence>
            {isMobileSummaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden border-t border-white/10 bg-ink-deep/50 px-4 py-6"
              >
                {renderSummaryContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. MAIN CHECKOUT BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
        {step === "confirmation" && orderSummary ? (
          /* ================= STEP 4: ORDER CONFIRMATION (DELIGHT & STAGGER) ================= */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="max-w-3xl mx-auto space-y-6 sm:space-y-10 py-4 sm:py-6"
          >
            {/* Celebration Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="bg-ink border border-gold/40 rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-cinnamon/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Scale-in Checkmark Badge */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                  </motion.div>
                </motion.div>

                <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-gold block">
                  Order Successfully Placed
                </span>

                <h1 className="font-serif text-2xl sm:text-5xl font-light text-paper-light">
                  Thank You, {orderSummary.shippingAddress.firstName}
                </h1>

                <p className="font-serif italic text-sm sm:text-lg text-sand/90 font-light max-w-lg mx-auto leading-relaxed">
                  Your pieces are being prepared with mindful care in Brisbane. We have sent a confirmation email with tracking details to{" "}
                  <strong className="text-gold font-normal break-all">{orderSummary.shippingAddress.email}</strong>.
                </p>

                <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 bg-white/5 border border-white/15 rounded-2xl mt-4">
                  <span className="text-xs font-sans uppercase tracking-widest text-sand/70">Order Reference:</span>
                  <span className="font-mono text-sm sm:text-base text-gold font-semibold">{orderSummary.orderId}</span>
                </div>
              </div>
            </motion.div>

            {/* Delivery & Address Details */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-gold text-xs uppercase font-sans tracking-widest">
                  <Clock className="w-4 h-4" />
                  <span>Estimated Delivery Window</span>
                </div>
                <p className="font-serif text-lg sm:text-xl text-paper-light">
                  {orderSummary.shippingAddress.method === "express"
                    ? "1 – 2 Business Days (Express Courier)"
                    : "3 – 5 Business Days (Standard Tracked)"}
                </p>
                <p className="text-xs font-sans text-sand/70">
                  Australia Post Carbon Neutral Tracked Delivery with signature on arrival.
                </p>
              </div>

              <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-gold text-xs uppercase font-sans tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <p className="font-serif text-sm sm:text-base text-paper-light leading-snug break-words">
                  {orderSummary.shippingAddress.firstName} {orderSummary.shippingAddress.lastName}
                  <br />
                  {orderSummary.shippingAddress.address}
                  {orderSummary.shippingAddress.apartment && `, ${orderSummary.shippingAddress.apartment}`}
                  <br />
                  {orderSummary.shippingAddress.suburb}, {orderSummary.shippingAddress.state} {orderSummary.shippingAddress.postcode}
                  <br />
                  {orderSummary.shippingAddress.country}
                </p>
              </div>
            </motion.div>

            {/* Order Items Breakdown */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-8 space-y-6"
            >
              <h3 className="font-serif text-lg sm:text-xl font-medium text-paper-light border-b border-white/10 pb-4">
                Items in This Order ({orderSummary.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              <div className="space-y-4">
                {orderSummary.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 sm:gap-4 py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-xl bg-black/40 border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm sm:text-base text-paper-light truncate">{item.product.name}</h4>
                        <p className="text-xs font-sans text-sand/70">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-[11px] font-sans uppercase tracking-widest text-gold mt-0.5">
                          {item.product.colorName}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-sm sm:text-base text-paper-light font-semibold flex-shrink-0">
                      ${item.product.priceAud * item.quantity} AUD
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-sand/80">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal} AUD</span>
                </div>
                {orderSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Promotional Discount</span>
                    <span>-${orderSummary.discountAmount} AUD</span>
                  </div>
                )}
                <div className="flex justify-between text-sand/80">
                  <span>Shipping</span>
                  <span>{orderSummary.shippingFee === 0 ? "FREE" : `$${orderSummary.shippingFee} AUD`}</span>
                </div>
                <div className="flex justify-between text-base font-serif text-paper-light font-bold pt-3 border-t border-white/10">
                  <span>Total Paid</span>
                  <span className="text-gold text-lg">${orderSummary.total} AUD</span>
                </div>
              </div>
            </motion.div>

            {/* Action Return */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="text-center pt-2 sm:pt-4"
            >
              <button
                type="button"
                onClick={handleContinueShopping}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-cinnamon hover:text-white transition-all shadow-xl min-h-[48px] cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* ================= STEPS 1–3: FORM & DESKTOP SIDEBAR ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: Interactive Form Step (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {step === "shipping" && (
                  /* STEP 1: SHIPPING */
                  <motion.div
                    key="step-shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold block mb-1">
                        Step 1 of 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-4xl text-paper-light font-light">
                        Shipping & Delivery Address
                      </h2>
                    </div>

                    <form onSubmit={handleNextToPayment} className="space-y-6">
                      {/* Contact Info */}
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-8 space-y-4">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-paper-light mb-2">
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              First Name *
                            </label>
                            <input
                              type="text"
                              maxLength={50}
                              value={shipping.firstName}
                              onChange={(e) => {
                                setShipping({ ...shipping, firstName: e.target.value });
                                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                              }}
                              placeholder="e.g. Eleanor"
                              className={`w-full bg-white/5 border ${
                                errors.firstName ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.firstName && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              maxLength={50}
                              value={shipping.lastName}
                              onChange={(e) => {
                                setShipping({ ...shipping, lastName: e.target.value });
                                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                              }}
                              placeholder="e.g. Sterling"
                              className={`w-full bg-white/5 border ${
                                errors.lastName ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.lastName && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              maxLength={100}
                              value={shipping.email}
                              onChange={(e) => {
                                setShipping({ ...shipping, email: e.target.value });
                                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                              }}
                              placeholder="name@domain.com"
                              className={`w-full bg-white/5 border ${
                                errors.email ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.email && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              maxLength={20}
                              value={shipping.phone}
                              onChange={handlePhoneChange}
                              placeholder="+61 400 000 000"
                              className={`w-full bg-white/5 border ${
                                errors.phone ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.phone && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-8 space-y-4">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-paper-light mb-2">
                          Australian Delivery Address
                        </h3>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            maxLength={120}
                            value={shipping.address}
                            onChange={(e) => {
                              setShipping({ ...shipping, address: e.target.value });
                              if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                            }}
                            placeholder="e.g. 42 James Street"
                            className={`w-full bg-white/5 border ${
                              errors.address ? "border-terracotta/80" : "border-white/15"
                            } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                          />
                          {errors.address && (
                            <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                            Apartment / Suite / Unit (Optional)
                          </label>
                          <input
                            type="text"
                            maxLength={40}
                            value={shipping.apartment}
                            onChange={(e) => setShipping({ ...shipping, apartment: e.target.value })}
                            placeholder="e.g. Unit 4B"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Suburb / City *
                            </label>
                            <input
                              type="text"
                              maxLength={60}
                              value={shipping.suburb}
                              onChange={(e) => {
                                setShipping({ ...shipping, suburb: e.target.value });
                                if (errors.suburb) setErrors((prev) => ({ ...prev, suburb: "" }));
                              }}
                              placeholder="e.g. Fortitude Valley"
                              className={`w-full bg-white/5 border ${
                                errors.suburb ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.suburb && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.suburb}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              State *
                            </label>
                            <select
                              value={shipping.state}
                              onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                              className="w-full bg-ink border border-white/15 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]"
                            >
                              {AUSTRALIAN_STATES.map((s) => (
                                <option key={s.code} value={s.code}>
                                  {s.code} — {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Postcode *
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              value={shipping.postcode}
                              onChange={handlePostcodeChange}
                              placeholder="4006"
                              className={`w-full bg-white/5 border ${
                                errors.postcode ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.postcode && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.postcode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Method Options */}
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-8 space-y-4">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-paper-light mb-2">
                          Select Delivery Method
                        </h3>

                        <div className="space-y-3">
                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer min-h-[52px] ${
                              shipping.method === "standard"
                                ? "bg-white/10 border-gold shadow-md"
                                : "bg-white/5 border-white/10 hover:border-white/25"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={shipping.method === "standard"}
                                onChange={() => setShipping({ ...shipping, method: "standard" })}
                                className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                              />
                              <div>
                                <p className="text-sm font-sans font-medium text-paper-light">
                                  Standard Tracked Delivery (Australia Post)
                                </p>
                                <p className="text-xs font-sans text-sand/70">Estimated 3–5 business days</p>
                              </div>
                            </div>
                            <span className="font-serif text-sm font-semibold text-gold">
                              {isFreeShipping ? "FREE" : "$12 AUD"}
                            </span>
                          </label>

                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer min-h-[52px] ${
                              shipping.method === "express"
                                ? "bg-white/10 border-gold shadow-md"
                                : "bg-white/5 border-white/10 hover:border-white/25"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={shipping.method === "express"}
                                onChange={() => setShipping({ ...shipping, method: "express" })}
                                className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                              />
                              <div>
                                <p className="text-sm font-sans font-medium text-paper-light">
                                  Express Priority Courier (Next Day Dispatch)
                                </p>
                                <p className="text-xs font-sans text-sand/70">Estimated 1–2 business days</p>
                              </div>
                            </div>
                            <span className="font-serif text-sm font-semibold text-gold">$18 AUD</span>
                          </label>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-cinnamon hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer min-h-[48px]"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === "payment" && (
                  /* STEP 2: PAYMENT (DEMO) */
                  <motion.div
                    key="step-payment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold block mb-1">
                        Step 2 of 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-4xl text-paper-light font-light">
                        Payment & Billing
                      </h2>
                    </div>

                    {/* Demo Disclaimer Box */}
                    <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div className="text-xs font-sans text-sand/90 space-y-1">
                        <p className="font-medium text-gold">Demo Checkout Demonstration</p>
                        <p>
                          This checkout is running in mock presentation mode. No actual charge will be made to any credit card entered.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleNextToReview} className="space-y-6">
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-8 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-paper-light">
                            Credit or Debit Card
                          </h3>
                          {/* Payment method trust badges */}
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-sans font-black italic tracking-tight text-paper">
                              VISA
                            </span>
                            <span className="flex items-center -space-x-1 px-2 py-1 rounded-md bg-white/10 border border-white/15">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] opacity-90 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] opacity-90 inline-block" />
                            </span>
                            <span className="px-2 py-1 rounded-md bg-white border border-white/15 text-[9px] font-sans font-bold uppercase tracking-tight text-[#006FCF]">
                              AMEX
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            maxLength={60}
                            value={payment.cardName}
                            onChange={(e) => {
                              setPayment({ ...payment, cardName: e.target.value });
                              if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }));
                            }}
                            placeholder="Name as it appears on card"
                            className={`w-full bg-white/5 border ${
                              errors.cardName ? "border-terracotta/80" : "border-white/15"
                            } rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                          />
                          {errors.cardName && (
                            <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              {errors.cardName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            value={payment.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 1234 5678 9012"
                            className={`w-full bg-white/5 border ${
                              errors.cardNumber ? "border-terracotta/80" : "border-white/15"
                            } rounded-xl px-4 py-3 text-sm text-paper font-mono focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                          />
                          {errors.cardNumber && (
                            <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Expiry Date (MM/YY) *
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              value={payment.expiry}
                              onChange={handleExpiryChange}
                              placeholder="08/28"
                              className={`w-full bg-white/5 border ${
                                errors.expiry ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper font-mono focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.expiry && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.expiry}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-sans uppercase tracking-wider text-sand/80 mb-1.5">
                              Security Code (CVC) *
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={payment.cvc}
                              onChange={handleCvcChange}
                              placeholder="123"
                              className={`w-full bg-white/5 border ${
                                errors.cvc ? "border-terracotta/80" : "border-white/15"
                              } rounded-xl px-4 py-3 text-sm text-paper font-mono focus:outline-none focus:border-gold transition-colors min-h-[46px]`}
                            />
                            {errors.cvc && (
                              <p className="text-[11px] font-sans text-terracotta mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.cvc}
                              </p>
                            )}
                          </div>
                        </div>

                        <label className="flex items-center gap-2.5 pt-2 text-xs font-sans text-sand/80 cursor-pointer select-none min-h-[44px]">
                          <input
                            type="checkbox"
                            checked={payment.sameAsShipping}
                            onChange={(e) => setPayment({ ...payment, sameAsShipping: e.target.checked })}
                            className="accent-[#C5A059] rounded w-4 h-4 cursor-pointer"
                          />
                          <span>Billing address matches Australian shipping address</span>
                        </label>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => setStep("shipping")}
                          className="px-6 py-4 rounded-full border border-white/20 text-paper font-sans text-xs uppercase tracking-[0.2em] hover:border-gold transition-colors min-h-[48px] cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-4 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-cinnamon hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer min-h-[48px]"
                        >
                          <span>Review Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === "review" && (
                  /* STEP 3: REVIEW & PLACE ORDER */
                  <motion.div
                    key="step-review"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold block mb-1">
                        Step 3 of 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-4xl text-paper-light font-light">
                        Review & Confirm Order
                      </h2>
                    </div>

                    {/* Summary recap cards */}
                    <div className="space-y-4">
                      {/* Shipping Summary */}
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-6 flex items-start justify-between gap-4">
                        <div className="space-y-1 text-xs font-sans min-w-0">
                          <span className="text-[10px] uppercase tracking-widest text-gold block mb-1">
                            Shipping To:
                          </span>
                          <p className="text-paper-light font-medium truncate">
                            {shipping.firstName} {shipping.lastName} • {shipping.phone}
                          </p>
                          <p className="text-sand/80 break-words">
                            {shipping.address}
                            {shipping.apartment && `, ${shipping.apartment}`}
                            <br />
                            {shipping.suburb}, {shipping.state} {shipping.postcode}
                          </p>
                          <p className="text-gold pt-1">
                            Method: {shipping.method === "express" ? "Express Courier ($18)" : "Standard Tracked"}
                          </p>
                        </div>
                        <button
                          onClick={() => setStep("shipping")}
                          className="text-xs uppercase font-sans tracking-widest text-gold underline underline-offset-4 hover:text-cinnamon p-2 min-h-[44px] flex items-center cursor-pointer flex-shrink-0"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-ink border border-white/10 rounded-3xl p-5 sm:p-6 flex items-start justify-between gap-4">
                        <div className="space-y-1 text-xs font-sans min-w-0">
                          <span className="text-[10px] uppercase tracking-widest text-gold block mb-1">
                            Payment Method:
                          </span>
                          <p className="text-paper-light font-medium">
                            Card ending in {payment.cardNumber.replace(/\s+/g, "").slice(-4) || "8921"}
                          </p>
                          <p className="text-sand/80 truncate">
                            Cardholder: {payment.cardName} • Exp: {payment.expiry}
                          </p>
                          <span className="inline-block text-[10px] uppercase tracking-wider text-sage bg-sage/10 px-2 py-0.5 rounded mt-1">
                            Demo Mode Verified
                          </span>
                        </div>
                        <button
                          onClick={() => setStep("payment")}
                          className="text-xs uppercase font-sans tracking-widest text-gold underline underline-offset-4 hover:text-cinnamon p-2 min-h-[44px] flex items-center cursor-pointer flex-shrink-0"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Ethical guarantee banner */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      <p className="text-xs font-sans text-sand/80 leading-relaxed">
                        Ethically crafted in limited batches in Sri Lanka. 30-day effortless Australian exchange guarantee.
                      </p>
                    </div>

                    {/* Terms of Service Consent Checkbox */}
                    <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer select-none min-h-[48px]">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="accent-[#C5A059] rounded mt-0.5 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-sans text-sand/90 leading-relaxed">
                        I agree to BINDY&apos;s <span className="text-gold underline underline-offset-2">Terms of Service</span> and <span className="text-gold underline underline-offset-2">Privacy Policy</span>.
                      </span>
                    </label>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setStep("payment")}
                        disabled={isSubmitting}
                        className="px-6 py-4 rounded-full border border-white/20 text-paper font-sans text-xs uppercase tracking-[0.2em] hover:border-gold transition-colors min-h-[48px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={!agreedToTerms || isSubmitting}
                        className={`flex-1 py-4 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 min-h-[48px] ${
                          !agreedToTerms || isSubmitting
                            ? "bg-sand/20 text-sand/50 border border-white/5 cursor-not-allowed shadow-none pointer-events-none"
                            : "bg-gold text-charcoal hover:bg-cinnamon hover:text-white shadow-2xl cursor-pointer"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-charcoal" />
                            <span>Preparing Your Order...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Place Order • ${total} AUD</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Sticky Order Summary (Desktop only >= lg) */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 self-start">
              <div className="bg-ink border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif text-xl font-medium text-paper-light">
                    Order Summary
                  </h3>
                  <span className="text-xs font-sans text-sand/70">
                    {totalItemsCount} items
                  </span>
                </div>

                {renderSummaryContent()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOTER */}
      <footer className="py-6 border-t border-white/10 text-center text-xs text-sand/60 font-sans mt-8 sm:mt-12 px-4">
        <p>© {new Date().getFullYear()} BINDY Clothing • Designed in Australia, Inspired by Sri Lanka</p>
      </footer>
    </main>
  );
}
