"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Sparkles,
  LogOut,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import {
  getAccount,
  saveAccount,
  clearAccount,
  subscribeAccount,
  getOrders,
  subscribeOrders,
  type UserAccount,
  type OrderRecord,
  type SavedAddress,
} from "@/lib/account";
import { getCart, saveCart, type CartItem } from "@/lib/cart";
import { type Category } from "@/lib/products";
import { ambientPlayer } from "@/lib/ambientSound";

const AU_SIZES = [
  "AU 6 (XS)",
  "AU 8 (S)",
  "AU 10 (M)",
  "AU 12 (L)",
  "AU 14 (XL)",
];

const AUSTRALIAN_STATES = [
  "Queensland (QLD)",
  "New South Wales (NSW)",
  "Victoria (VIC)",
  "South Australia (SA)",
  "Western Australia (WA)",
  "Tasmania (TAS)",
  "Australian Capital Territory (ACT)",
  "Northern Territory (NT)",
];

const FIT_OPTIONS: { id: "fitted" | "true" | "relaxed"; label: string; desc: string }[] = [
  { id: "fitted", label: "Fitted & Sculpted", desc: "Closer tailoring through bodice & waist" },
  { id: "true", label: "True to Size", desc: "Classic proportioned silhouette" },
  { id: "relaxed", label: "Relaxed & Flowing", desc: "Breezy drape for effortless warmth" },
];

const CATEGORY_OPTIONS: { category: Category; desc: string }[] = [
  { category: "Dresses", desc: "Gathered voile & bias maxis" },
  { category: "Tops & Blouses", desc: "Resort cuts & cutwork lace" },
  { category: "Skirts & Pants", desc: "Liquid satin & tailored linen" },
  { category: "Two Piece Sets", desc: "Matching artisan coordinates" },
];

// Luxury Underline Input with High-Contrast Labels and Focus Highlight
function UnderlineInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 w-full text-left">
      <label
        htmlFor={id}
        className="block text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-medium"
      >
        {label}
      </label>
      <div
        className={`relative border-b-2 ${
          error ? "border-terracotta bg-terracotta/5" : "border-sand/50 focus-within:border-gold bg-sand/10"
        } px-4 pt-3 pb-2.5 rounded-t-xl transition-colors duration-300 flex items-center`}
      >
        <input
          id={id}
          type={actualType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent font-serif text-base sm:text-lg text-charcoal placeholder:text-muted/50 focus:outline-none tracking-wide"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted hover:text-charcoal p-1 transition-colors flex-shrink-0 cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-gold" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-sans text-terracotta flex items-center gap-1.5 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// Luxury Underline Select with High-Contrast Label
function UnderlineSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div className="space-y-2 w-full text-left">
      <label
        htmlFor={id}
        className="block text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-medium"
      >
        {label}
      </label>
      <div
        className={`relative border-b-2 ${
          error ? "border-terracotta bg-terracotta/5" : "border-sand/50 focus-within:border-gold bg-sand/10"
        } px-4 pt-3 pb-2.5 rounded-t-xl transition-colors duration-300`}
      >
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent font-serif text-base sm:text-lg text-charcoal focus:outline-none cursor-pointer tracking-wide [&>option]:bg-paper-light [&>option]:text-charcoal"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs font-sans text-terracotta flex items-center gap-1.5 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Cart state for navbar drawer
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  // Signed-Out View States: 'signin' | 'signup-1' | 'signup-2' | 'signup-3' | 'signup-complete'
  const [authMode, setAuthMode] = useState<
    "signin" | "signup-1" | "signup-2" | "signup-3" | "signup-complete"
  >("signin");

  // Signed-In Dashboard Active Tab: 'profile' | 'orders' | 'address' | 'preferences'
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "address" | "preferences">("profile");

  // Sign In Form Data
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinErrors, setSigninErrors] = useState<Record<string, string>>({});

  // Sign Up Form Data
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // Style Preferences State
  const [prefCategory, setPrefCategory] = useState<Category>("Dresses");
  const [prefFit, setPrefFit] = useState<"fitted" | "true" | "relaxed">("true");
  const [prefSize, setPrefSize] = useState<string>("AU 8 (S)");

  // Address State
  const [addressData, setAddressData] = useState<SavedAddress>({
    address: "",
    apartment: "",
    suburb: "",
    state: "Queensland (QLD)",
    postcode: "",
    country: "Australia",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Edit Profile Details
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSavedFeedback, setIsSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setCartItems(getCart());

    const syncAccountData = () => {
      const acc = getAccount();
      setAccount(acc);
      setOrders(getOrders());
      if (acc) {
        setEditName(acc.name);
        setEditEmail(acc.email);
        if (acc.savedAddress) {
          setAddressData(acc.savedAddress);
        }
        if (acc.preferences) {
          setPrefCategory((acc.preferences.favoriteCategory as Category) || "Dresses");
          setPrefFit(acc.preferences.preferredFit || "true");
          setPrefSize(acc.preferences.preferredSize || "AU 8 (S)");
        }
      }
    };

    syncAccountData();
    const unsubAcc = subscribeAccount(syncAccountData);
    const unsubOrd = subscribeOrders(syncAccountData);

    return () => {
      unsubAcc();
      unsubOrd();
    };
  }, []);

  const handleAddToCart = (product: any, size: string) => {
    // Helper if needed by drawer
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((item) => {
          if (item.product.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      saveCart(next);
      return next;
    });
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => !(item.product.id === id && item.size === size));
      saveCart(next);
      return next;
    });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── CUSTOM VALIDATION HANDLERS ──

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!signinEmail.trim()) {
      errors.email = "Please enter your email address";
    } else if (!signinEmail.includes("@") || !signinEmail.includes(".")) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      setSigninErrors(errors);
      return;
    }

    setSigninErrors({});
    const existing = getAccount();
    if (existing && existing.email.toLowerCase() === signinEmail.trim().toLowerCase()) {
      setAccount(existing);
    } else {
      const [fName] = signinEmail.split("@");
      const cleanName = fName.charAt(0).toUpperCase() + fName.slice(1);
      const acc: UserAccount = {
        name: cleanName,
        email: signinEmail.trim().toLowerCase(),
        preferences: {
          favoriteCategory: "Dresses",
          preferredFit: "true",
          preferredSize: "AU 8 (S)",
        },
      };
      saveAccount(acc);
      setAccount(acc);
    }
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!signupName.trim()) {
      errors.name = "Please enter your full name";
    }
    if (!signupEmail.trim()) {
      errors.email = "Please enter your email address";
    } else if (!signupEmail.includes("@") || !signupEmail.includes(".")) {
      errors.email = "Please enter a valid email address";
    }
    if (!signupPassword) {
      errors.password = "Please create a password";
    } else if (signupPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    setAuthMode("signup-2");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteSignup = (skipAddress = false) => {
    if (!skipAddress) {
      const errors: Record<string, string> = {};
      if (!addressData.address.trim()) errors.address = "Please enter your street address";
      if (!addressData.suburb.trim()) errors.suburb = "Please enter your suburb or city";
      if (!addressData.postcode.trim() || addressData.postcode.length < 3) {
        errors.postcode = "Please enter a valid postcode";
      }

      if (Object.keys(errors).length > 0) {
        setAddressErrors(errors);
        return;
      }
    }

    setAddressErrors({});
    const newAccount: UserAccount = {
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      preferences: {
        favoriteCategory: prefCategory,
        preferredFit: prefFit,
        preferredSize: prefSize,
      },
      savedAddress: skipAddress || !addressData.address.trim() ? undefined : addressData,
      memberSince: new Date().toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      }),
    };

    saveAccount(newAccount);
    setAccount(newAccount);
    setAuthMode("signup-complete");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const errors: Record<string, string> = {};
    if (!editName.trim()) errors.name = "Please enter your name";
    if (!editEmail.trim() || !editEmail.includes("@")) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    const updated: UserAccount = {
      ...account,
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback("profile");
    setTimeout(() => setIsSavedFeedback(null), 2500);
  };

  const handleSaveAddressDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const errors: Record<string, string> = {};
    if (!addressData.address.trim()) errors.address = "Please enter your street address";
    if (!addressData.suburb.trim()) errors.suburb = "Please enter your suburb or city";
    if (!addressData.postcode.trim() || addressData.postcode.length < 3) {
      errors.postcode = "Please enter a valid postcode";
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddressErrors({});
    const updated: UserAccount = {
      ...account,
      savedAddress: addressData,
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback("address");
    setTimeout(() => setIsSavedFeedback(null), 2500);
  };

  const handleSavePreferences = () => {
    if (!account) return;

    const updated: UserAccount = {
      ...account,
      preferences: {
        favoriteCategory: prefCategory,
        preferredFit: prefFit,
        preferredSize: prefSize,
      },
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback("preferences");
    setTimeout(() => setIsSavedFeedback(null), 2500);
  };

  const handleSignOut = () => {
    clearAccount();
    setAccount(null);
    setAuthMode("signin");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSigninEmail("");
    setSigninPassword("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-paper text-charcoal selection:bg-gold selection:text-white flex flex-col justify-between">
      {/* 1. LUXURY NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        {/* ══════════════════════════════════════════════════════
            SCENARIO 1: SIGNED OUT (PAGE SIGN IN & 3-STEP SIGN UP)
           ══════════════════════════════════════════════════════ */}
        {!account && authMode !== "signup-complete" && (
          <div className="max-w-xl mx-auto space-y-8">
            {/* Top Switcher Segmented Control */}
            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full bg-paper-dark p-1.5 border border-sand/40 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSigninErrors({});
                    setSignupErrors({});
                    setAuthMode("signin");
                  }}
                  className={`px-6 py-2 rounded-full text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all duration-200 cursor-pointer ${
                    authMode === "signin"
                      ? "bg-gold text-charcoal font-bold shadow-md scale-102"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSigninErrors({});
                    setSignupErrors({});
                    setAuthMode("signup-1");
                  }}
                  className={`px-6 py-2 rounded-full text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all duration-200 cursor-pointer ${
                    authMode.startsWith("signup")
                      ? "bg-gold text-charcoal font-bold shadow-md scale-102"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  Join The Circle (3 Steps)
                </button>
              </div>
            </div>

            {/* ── FLOW A: SIGN IN ── */}
            {authMode === "signin" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-paper-light border border-sand/40 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>The Bindy Circle</span>
                  </div>
                  <h1 className="font-serif text-4xl sm:text-5xl text-charcoal font-light tracking-wide leading-tight">
                    Welcome to <span className="italic font-serif">BINDY.</span>
                  </h1>
                  <p className="font-serif italic text-base sm:text-lg text-muted font-light leading-relaxed max-w-md mx-auto">
                    Sign in to view your handcrafted garment receipts, saved delivery addresses, and private previews.
                  </p>
                </div>

                <form noValidate onSubmit={handleSignIn} className="space-y-6 max-w-md mx-auto">
                  <UnderlineInput
                    id="page-signin-email"
                    label="Email Address"
                    type="email"
                    value={signinEmail}
                    onChange={(e) => {
                      setSigninEmail(e.target.value);
                      if (signinErrors.email) setSigninErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="e.g. maya@example.com.au"
                    error={signinErrors.email}
                  />

                  <UnderlineInput
                    id="page-signin-password"
                    label="Password"
                    type="password"
                    value={signinPassword}
                    onChange={(e) => {
                      setSigninPassword(e.target.value);
                      if (signinErrors.password) setSigninErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Enter your password"
                    error={signinErrors.password}
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.22em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-sand/30 space-y-3">
                    <p className="text-xs font-sans text-muted font-light">
                      New to BINDY slow fashion?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSigninErrors({});
                        setSignupErrors({});
                        setAuthMode("signup-1");
                      }}
                      className="text-xs font-sans uppercase tracking-[0.2em] text-gold hover:text-charcoal font-semibold transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Create your Member Profile (3 steps)
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <Link
                      href="/"
                      className="text-xs font-sans text-muted hover:text-charcoal transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Continue as guest • Return to shopping</span>
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── FLOW B: 3-STEP SIGN UP (STEP 1: BASICS) ── */}
            {authMode === "signup-1" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-paper-light border border-sand/40 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8"
              >
                {/* Step Indicator */}
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
                    <span>Step 1 of 3</span>
                    <span className="text-sand">•</span>
                    <span>Account Basics</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2.5 pt-1 max-w-md mx-auto">
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                    <div className="h-1.5 rounded-full bg-sand/30" />
                    <div className="h-1.5 rounded-full bg-sand/30" />
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide leading-tight pt-2">
                    Create Your Member Profile
                  </h1>
                </div>

                <form noValidate onSubmit={handleNextToStep2} className="space-y-6 max-w-md mx-auto">
                  <UnderlineInput
                    id="signup-name"
                    label="Full Name"
                    type="text"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (signupErrors.name) setSignupErrors((p) => ({ ...p, name: "" }));
                    }}
                    placeholder="e.g. Maya Ranasinghe"
                    error={signupErrors.name}
                  />

                  <UnderlineInput
                    id="signup-email"
                    label="Email Address"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (signupErrors.email) setSignupErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="e.g. maya@example.com.au"
                    error={signupErrors.email}
                  />

                  <UnderlineInput
                    id="signup-pass"
                    label="Create Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (signupErrors.password) setSignupErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="At least 6 characters"
                    error={signupErrors.password}
                  />

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.22em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue to Style Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className="text-xs font-sans text-muted hover:text-gold transition-colors cursor-pointer"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── FLOW B: 3-STEP SIGN UP (STEP 2: STYLE PREFERENCES) ── */}
            {authMode === "signup-2" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-paper-light border border-sand/40 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8"
              >
                {/* Step Indicator */}
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
                    <span>Step 2 of 3</span>
                    <span className="text-sand">•</span>
                    <span>Style Profile</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2.5 pt-1 max-w-md mx-auto">
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                    <div className="h-1.5 rounded-full bg-sand/30" />
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide leading-tight pt-2">
                    Your Wardrobe Preferences
                  </h1>
                  <p className="font-serif italic text-base text-muted font-light max-w-md mx-auto">
                    Help us personalize your slow fashion recommendations and sizing notes.
                  </p>
                </div>

                <div className="space-y-8 max-w-lg mx-auto">
                  {/* 1. Favorite Category */}
                  <div className="space-y-3.5">
                    <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                      Favorite Silhouette
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {CATEGORY_OPTIONS.map((item) => {
                        const active = prefCategory === item.category;
                        return (
                          <button
                            key={item.category}
                            type="button"
                            onClick={() => setPrefCategory(item.category)}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold/15 border-gold shadow-sm ring-1 ring-gold/40"
                                : "bg-paper border-sand/40 hover:border-gold/50"
                            }`}
                          >
                            <p className={`font-serif text-lg font-medium ${active ? "text-charcoal font-semibold" : "text-charcoal"}`}>
                              {item.category}
                            </p>
                            <p className="text-xs font-sans text-muted mt-1 font-light leading-relaxed">
                              {item.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Preferred Fit */}
                  <div className="space-y-3.5">
                    <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                      Preferred Fit Feel
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {FIT_OPTIONS.map((fit) => {
                        const active = prefFit === fit.id;
                        return (
                          <button
                            key={fit.id}
                            type="button"
                            onClick={() => setPrefFit(fit.id)}
                            className={`p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold/15 border-gold text-charcoal font-bold ring-1 ring-gold/40"
                                : "bg-paper border-sand/40 text-charcoal hover:border-gold/50"
                            }`}
                          >
                            <p className="text-xs font-sans font-semibold tracking-wide">{fit.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Preferred AU Size */}
                  <div className="space-y-3.5">
                    <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                      Default AU Size
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {AU_SIZES.map((sz) => {
                        const active = prefSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPrefSize(sz)}
                            className={`px-4 py-2.5 rounded-full border text-xs font-sans transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold text-charcoal border-gold font-bold shadow-md scale-105"
                                : "bg-paper border-sand/40 text-charcoal hover:border-gold"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-sand/30">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup-1")}
                      className="px-6 py-3 rounded-full border border-sand/40 text-xs font-sans uppercase tracking-wider text-charcoal hover:border-gold bg-paper hover:bg-sand/15 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMode("signup-3")}
                      className="px-8 py-3.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <span>Next: Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FLOW B: 3-STEP SIGN UP (STEP 3: ADDRESS) ── */}
            {authMode === "signup-3" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-paper-light border border-sand/40 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8"
              >
                {/* Step Indicator */}
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
                    <span>Step 3 of 3</span>
                    <span className="text-sand">•</span>
                    <span>Australian Delivery Address</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2.5 pt-1 max-w-md mx-auto">
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                    <div className="h-1.5 rounded-full bg-gold shadow-sm" />
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide leading-tight pt-2">
                    Delivery Address
                  </h1>
                  <p className="font-serif italic text-base text-muted font-light max-w-md mx-auto">
                    Optional: Save your shipping address for effortless one-click checkout across all future seasonal drops.
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <UnderlineInput
                    id="address-street"
                    label="Street Address"
                    value={addressData.address}
                    onChange={(e) => {
                      setAddressData((a) => ({ ...a, address: e.target.value }));
                      if (addressErrors.address) setAddressErrors((p) => ({ ...p, address: "" }));
                    }}
                    placeholder="e.g. 42 James Street"
                    error={addressErrors.address}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <UnderlineInput
                      id="address-apt"
                      label="Apt / Suite (Optional)"
                      value={addressData.apartment || ""}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, apartment: e.target.value }))
                      }
                      placeholder="e.g. Apt 4B"
                    />

                    <UnderlineInput
                      id="address-suburb"
                      label="Suburb / City"
                      value={addressData.suburb}
                      onChange={(e) => {
                        setAddressData((a) => ({ ...a, suburb: e.target.value }));
                        if (addressErrors.suburb) setAddressErrors((p) => ({ ...p, suburb: "" }));
                      }}
                      placeholder="e.g. New Farm"
                      error={addressErrors.suburb}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <UnderlineSelect
                      id="address-state"
                      label="State / Territory"
                      value={addressData.state}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, state: e.target.value }))
                      }
                      options={AUSTRALIAN_STATES}
                    />

                    <UnderlineInput
                      id="address-postcode"
                      label="Postcode"
                      value={addressData.postcode}
                      onChange={(e) => {
                        setAddressData((a) => ({ ...a, postcode: e.target.value }));
                        if (addressErrors.postcode) setAddressErrors((p) => ({ ...p, postcode: "" }));
                      }}
                      placeholder="e.g. 4005"
                      error={addressErrors.postcode}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-sand/30">
                    <button
                      type="button"
                      onClick={() => handleCompleteSignup(true)}
                      className="text-xs font-sans uppercase tracking-[0.2em] text-muted hover:text-gold underline underline-offset-4 transition-colors cursor-pointer font-medium"
                    >
                      Skip for now, add later
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup-2")}
                        className="px-6 py-3.5 rounded-full border border-sand/40 text-xs font-sans text-charcoal hover:border-gold bg-paper hover:bg-sand/15 transition-colors cursor-pointer font-medium"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCompleteSignup(false)}
                        className="flex-1 sm:flex-none px-8 py-3.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Save & Complete</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ── FLOW B: SIGN UP COMPLETION ── */}
        {!account && authMode === "signup-complete" && (
          <div className="max-w-xl mx-auto py-16 text-center space-y-8 bg-paper-light border border-sand/40 rounded-3xl p-8 sm:p-12 shadow-sm">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold shadow-md"
            >
              <Check className="w-10 h-10 stroke-[2.5]" />
            </motion.div>

            <div className="space-y-3">
              <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                Origins Member Created
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide">
                Welcome to The Circle, {signupName}!
              </h1>
              <p className="font-serif italic text-base text-muted font-light leading-relaxed max-w-md mx-auto">
                Your wardrobe profile has been established. You now have access to tailored size recommendations, private drops, and fast Australian shipping.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  const acc = getAccount();
                  if (acc) setAccount(acc);
                }}
                className="px-10 py-4 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg hover:bg-cinnamon hover:text-white cursor-pointer"
              >
                Access My Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SCENARIO 2: SIGNED IN DASHBOARD (TWO-COLUMN DESKTOP)
           ══════════════════════════════════════════════════════ */}
        {account && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-sans tracking-wider uppercase text-muted">
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gold font-semibold">Account Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-charcoal capitalize font-medium">{activeTab}</span>
            </div>

            {/* Mobile Tab Row (Collapses from sidebar on small screens) */}
            <div className="lg:hidden flex border-b border-sand/30 gap-2 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: `Orders (${orders.length})`, icon: Package },
                { id: "address", label: "Address", icon: MapPin },
                { id: "preferences", label: "Preferences", icon: Sparkles },
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      active
                        ? "bg-gold text-charcoal font-bold border-gold shadow-sm"
                        : "bg-paper-light border-sand/40 text-muted hover:text-charcoal"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dashboard Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ── LEFT SIDEBAR (~280px / 4 cols) ── */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-paper-light border border-sand/40 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-sand/20 border-2 border-gold flex items-center justify-center text-charcoal font-serif text-2xl shadow-sm ring-4 ring-gold/15 select-none flex-shrink-0">
                      {getInitials(account.name)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium truncate leading-snug">
                        {account.name}
                      </h2>
                      <p className="text-xs font-sans text-muted truncate font-light mt-0.5">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-xs font-sans text-muted">
                    <span className="inline-flex items-center gap-1.5 text-gold font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      Origins Circle
                    </span>
                    <span>{account.memberSince ? `Since ${account.memberSince}` : "Active Member"}</span>
                  </div>
                </div>

                {/* Vertical Navigation Menu (Desktop) */}
                <div className="hidden lg:block bg-paper-light border border-sand/40 rounded-3xl p-3 shadow-sm space-y-1">
                  {[
                    { id: "profile", label: "Personal Profile", desc: "Name & contact details", icon: User },
                    { id: "orders", label: `Order History (${orders.length})`, desc: "Receipts & tracking", icon: Package },
                    { id: "address", label: "Delivery Address", desc: "Default Australian shipping", icon: MapPin },
                    { id: "preferences", label: "Style Preferences", desc: "Sizing & fit profile", icon: Sparkles },
                  ].map((item) => {
                    const active = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between border-l-4 ${
                          active
                            ? "bg-gold/15 border-gold text-charcoal font-semibold shadow-sm"
                            : "border-transparent text-muted hover:text-charcoal hover:bg-sand/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${active ? "text-gold" : "text-muted"}`} />
                          <div>
                            <p className={`text-xs font-sans uppercase tracking-[0.2em] font-medium ${active ? "text-charcoal font-bold" : "text-charcoal"}`}>
                              {item.label}
                            </p>
                            <p className="text-[11px] font-sans text-muted font-light mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${active ? "text-gold opacity-100" : "text-sand/40 opacity-0"}`} />
                      </button>
                    );
                  })}

                  {/* Sign Out Button */}
                  <div className="pt-3 border-t border-sand/30 mt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full p-3.5 rounded-2xl text-left text-muted hover:text-terracotta hover:bg-terracotta/10 transition-all duration-200 cursor-pointer flex items-center gap-3 text-xs font-sans uppercase tracking-[0.2em]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </aside>

              {/* ── RIGHT CONTENT PANEL (8 cols) ── */}
              <div className="lg:col-span-8 bg-paper-light border border-sand/40 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                {/* ── TAB 1: PROFILE ── */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="border-b border-sand/30 pb-5">
                      <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold block">
                        Account Settings
                      </span>
                      <h2 className="font-serif text-3xl text-charcoal font-light mt-1">
                        Personal Profile
                      </h2>
                    </div>

                    <form noValidate onSubmit={handleSaveProfileDetails} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <UnderlineInput
                          id="edit-name"
                          label="Full Name"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            if (profileErrors.name) setProfileErrors((p) => ({ ...p, name: "" }));
                          }}
                          error={profileErrors.name}
                        />

                        <UnderlineInput
                          id="edit-email"
                          label="Email Address"
                          type="email"
                          value={editEmail}
                          onChange={(e) => {
                            setEditEmail(e.target.value);
                            if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: "" }));
                          }}
                          error={profileErrors.email}
                        />
                      </div>

                      {/* Origins Membership Benefits Box */}
                      <div className="p-6 rounded-2xl bg-gold/10 border border-gold/30 space-y-2.5">
                        <div className="flex items-center gap-2 text-gold text-xs font-sans uppercase tracking-[0.2em] font-semibold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Origins Circle Membership</span>
                        </div>
                        <p className="text-xs font-sans text-charcoal/85 font-light leading-relaxed">
                          Enjoy priority access to limited seasonal drops, private tailoring sizing notes, and carbon-neutral Australian shipping.
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2"
                        >
                          {isSavedFeedback === "profile" ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Profile Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Profile Details</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── TAB 2: ORDERS ── */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <div className="border-b border-sand/30 pb-5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold block">
                          Garment Receipts
                        </span>
                        <h2 className="font-serif text-3xl text-charcoal font-light mt-1">
                          Order History
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-paper border border-sand/40 text-xs font-sans text-muted">
                        {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                      </span>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <Package className="w-12 h-12 text-muted/60 mx-auto stroke-[1.5]" />
                        <div className="space-y-1">
                          <p className="font-serif text-2xl text-charcoal font-light">
                            No orders placed yet.
                          </p>
                          <p className="text-xs font-sans text-muted font-light max-w-sm mx-auto">
                            Your handcrafted garment receipts and dispatch updates will appear here automatically upon checkout.
                          </p>
                        </div>
                        <div className="pt-2">
                          <Link
                            href="/#collection"
                            className="inline-block px-7 py-3 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-cinnamon hover:text-white transition-all shadow-md"
                          >
                            Explore Collection 01
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((ord) => (
                          <div
                            key={ord.orderRef}
                            className="p-5 sm:p-6 rounded-2xl bg-paper border border-sand/30 space-y-4 hover:border-gold/50 transition-colors shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pb-3 border-b border-sand/30">
                              <div>
                                <span className="font-mono text-gold font-bold tracking-wider text-sm">
                                  #{ord.orderRef}
                                </span>
                                <span className="text-muted ml-2">• Placed on {ord.date}</span>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-700 text-[10px] font-sans uppercase tracking-wider font-semibold self-start sm:self-auto">
                                {ord.status || "Confirmed"}
                              </span>
                            </div>

                            {/* Item List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {ord.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3.5 bg-paper-light p-3 rounded-xl border border-sand/30"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-18 object-cover rounded-lg bg-paper-dark flex-shrink-0"
                                  />
                                  <div className="text-xs min-w-0">
                                    <p className="font-serif text-charcoal font-medium truncate text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] font-sans text-muted mt-0.5">
                                      Size {item.size} • Qty {item.quantity}
                                    </p>
                                    <p className="font-serif text-charcoal font-semibold mt-1">
                                      ${item.priceAud * item.quantity} AUD
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-xs font-sans">
                              <span className="text-muted">
                                Total Items: {ord.itemCount || ord.items.length}
                              </span>
                              <span className="font-serif text-lg font-bold text-charcoal">
                                Paid: ${ord.total} AUD
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 3: ADDRESS ── */}
                {activeTab === "address" && (
                  <div className="space-y-8">
                    <div className="border-b border-sand/30 pb-5">
                      <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold block">
                        Shipping Defaults
                      </span>
                      <h2 className="font-serif text-3xl text-charcoal font-light mt-1">
                        Australian Delivery Address
                      </h2>
                    </div>

                    <form noValidate onSubmit={handleSaveAddressDetails} className="space-y-6">
                      <UnderlineInput
                        id="edit-addr-street"
                        label="Street Address"
                        value={addressData.address}
                        onChange={(e) => {
                          setAddressData((a) => ({ ...a, address: e.target.value }));
                          if (addressErrors.address) setAddressErrors((p) => ({ ...p, address: "" }));
                        }}
                        placeholder="e.g. 42 James Street"
                        error={addressErrors.address}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <UnderlineInput
                          id="edit-addr-apt"
                          label="Apt / Suite (Optional)"
                          value={addressData.apartment || ""}
                          onChange={(e) =>
                            setAddressData((a) => ({ ...a, apartment: e.target.value }))
                          }
                          placeholder="e.g. Apt 4B"
                        />

                        <UnderlineInput
                          id="edit-addr-suburb"
                          label="Suburb / City"
                          value={addressData.suburb}
                          onChange={(e) => {
                            setAddressData((a) => ({ ...a, suburb: e.target.value }));
                            if (addressErrors.suburb) setAddressErrors((p) => ({ ...p, suburb: "" }));
                          }}
                          placeholder="e.g. New Farm"
                          error={addressErrors.suburb}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <UnderlineSelect
                          id="edit-addr-state"
                          label="State / Territory"
                          value={addressData.state}
                          onChange={(e) =>
                            setAddressData((a) => ({ ...a, state: e.target.value }))
                          }
                          options={AUSTRALIAN_STATES}
                        />

                        <UnderlineInput
                          id="edit-addr-postcode"
                          label="Postcode"
                          value={addressData.postcode}
                          onChange={(e) => {
                            setAddressData((a) => ({ ...a, postcode: e.target.value }));
                            if (addressErrors.postcode) setAddressErrors((p) => ({ ...p, postcode: "" }));
                          }}
                          placeholder="e.g. 4005"
                          error={addressErrors.postcode}
                        />
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-sand/30">
                        <p className="text-xs font-sans text-muted font-light">
                          This address pre-fills automatically during checkout.
                        </p>

                        <button
                          type="submit"
                          className="px-8 py-3.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2"
                        >
                          {isSavedFeedback === "address" ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Address Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Delivery Address</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── TAB 4: PREFERENCES ── */}
                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <div className="border-b border-sand/30 pb-5">
                      <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold block">
                        Wardrobe Personalization
                      </span>
                      <h2 className="font-serif text-3xl text-charcoal font-light mt-1">
                        Style & Sizing Profile
                      </h2>
                    </div>

                    <div className="space-y-8">
                      {/* Favorite Category */}
                      <div className="space-y-3.5">
                        <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                          Favorite Silhouette
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {CATEGORY_OPTIONS.map((item) => {
                            const active = prefCategory === item.category;
                            return (
                              <button
                                key={item.category}
                                type="button"
                                onClick={() => setPrefCategory(item.category)}
                                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                                  active
                                    ? "bg-gold/15 border-gold shadow-sm ring-1 ring-gold/40"
                                    : "bg-paper border-sand/40 hover:border-gold/50"
                                }`}
                              >
                                <p className={`font-serif text-lg font-medium ${active ? "text-charcoal font-semibold" : "text-charcoal"}`}>
                                  {item.category}
                                </p>
                                <p className="text-xs font-sans text-muted mt-1 font-light leading-relaxed">
                                  {item.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Preferred Fit */}
                      <div className="space-y-3.5">
                        <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                          Preferred Fit Feel
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {FIT_OPTIONS.map((fit) => {
                            const active = prefFit === fit.id;
                            return (
                              <button
                                key={fit.id}
                                type="button"
                                onClick={() => setPrefFit(fit.id)}
                                className={`p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                  active
                                    ? "bg-gold/15 border-gold text-charcoal font-bold ring-1 ring-gold/40"
                                    : "bg-paper border-sand/40 text-charcoal hover:border-gold/50"
                                }`}
                              >
                                <p className="text-xs font-sans font-semibold tracking-wide">{fit.label}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* AU Size Chips */}
                      <div className="space-y-3.5">
                        <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted font-semibold block">
                          Default AU Size
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {AU_SIZES.map((sz) => {
                            const active = prefSize === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setPrefSize(sz)}
                                className={`px-4 py-2.5 rounded-full border text-xs font-sans transition-all duration-200 cursor-pointer ${
                                  active
                                    ? "bg-gold text-charcoal border-gold font-bold shadow-md scale-105"
                                    : "bg-paper border-sand/40 text-charcoal hover:border-gold"
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-6 flex items-center justify-end border-t border-sand/30">
                        <button
                          type="button"
                          onClick={handleSavePreferences}
                          className="px-8 py-3.5 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2"
                        >
                          {isSavedFeedback === "preferences" ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Preferences Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Wardrobe Preferences</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. LUXURY FOOTER */}
      <Footer />

      {/* Cart Drawer for Navbar integration */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </main>
  );
}
