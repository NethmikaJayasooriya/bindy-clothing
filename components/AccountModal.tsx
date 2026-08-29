"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  X,
  MapPin,
  Package,
  LogOut,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Tag,
  ShieldCheck,
  Heart,
  ChevronRight,
} from "lucide-react";
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
  type StylePreferences,
} from "@/lib/account";
import { CATEGORIES, type Category } from "@/lib/products";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

// Reusable Floating Label Input
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1 w-full">
      <div className="relative group">
        <input
          id={id}
          type={actualType}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          className={`w-full bg-white/5 border ${
            error ? "border-terracotta" : "border-white/15 focus:border-gold"
          } rounded-xl px-4 pt-5 pb-2 text-sm text-paper-light focus:outline-none transition-all peer`}
        />
        <label
          htmlFor={id}
          className="absolute left-4 top-3 text-sand/60 text-xs transition-all duration-200 pointer-events-none uppercase tracking-wider peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-gold"
        >
          {label} {required && "*"}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-sand/50 hover:text-white p-1 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] font-sans text-terracotta pl-1">{error}</p>}
    </div>
  );
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Navigation State
  // 'signin' | 'signup-1' | 'signup-2' | 'signup-3' | 'signup-complete' | 'panel'
  const [viewState, setViewState] = useState<
    "signin" | "signup-1" | "signup-2" | "signup-3" | "signup-complete" | "panel"
  >("signin");

  // Active Tab in Panel
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "address" | "preferences">("profile");

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

  // Edit Profile Panel State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSavedFeedback, setIsSavedFeedback] = useState<string | null>(null);

  // Sync state on mount and updates
  useEffect(() => {
    const update = () => {
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
          setPrefCategory(acc.preferences.favoriteCategory as Category || "Dresses");
          setPrefFit(acc.preferences.preferredFit || "true");
          setPrefSize(acc.preferences.preferredSize || "AU 8 (S)");
        }
        setViewState("panel");
      } else {
        setViewState("signin");
      }
    };

    update();
    const unsubAcc = subscribeAccount(update);
    const unsubOrd = subscribeOrders(update);

    return () => {
      unsubAcc();
      unsubOrd();
    };
  }, [isOpen]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSavedFeedback(null);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handlers for Multi-Step Signup
  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!signupName.trim()) errors.name = "Please enter your name";
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      errors.email = "Please enter a valid email address";
    }
    if (signupPassword.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    setViewState("signup-2");
  };

  const handleNextToStep3 = () => {
    setViewState("signup-3");
  };

  const handleCompleteSignup = (skipAddress = false) => {
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
    setViewState("signup-complete");

    // Auto-advance to dashboard after celebration
    setTimeout(() => {
      setViewState("panel");
    }, 2000);
  };

  // Sign In Handler
  const handleQuickSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setSignupErrors({ signinEmail: "Please enter a valid email address" });
      return;
    }

    const existing = getAccount();
    if (existing) {
      setAccount(existing);
      setViewState("panel");
    } else {
      // Fallback create simple account
      const [fName] = signupEmail.split("@");
      const cleanName = fName.charAt(0).toUpperCase() + fName.slice(1);
      const acc: UserAccount = {
        name: cleanName,
        email: signupEmail.trim().toLowerCase(),
        preferences: {
          favoriteCategory: "Dresses",
          preferredFit: "true",
          preferredSize: "AU 8 (S)",
        },
      };
      saveAccount(acc);
      setAccount(acc);
      setViewState("panel");
    }
  };

  // Save Profile Edits
  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const updated: UserAccount = {
      ...account,
      name: editName.trim() || account.name,
      email: editEmail.trim().toLowerCase() || account.email,
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback("profile");
    setTimeout(() => setIsSavedFeedback(null), 2500);
  };

  // Save Address Edits
  const handleSaveAddressDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const updated: UserAccount = {
      ...account,
      savedAddress: addressData,
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback("address");
    setTimeout(() => setIsSavedFeedback(null), 2500);
  };

  // Save Style Preferences Edits
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
    setViewState("signin");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-paper-light overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#161513] border border-sand/30 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto"
          >
            {/* Close Action */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-sand hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ══════════════════════════════════════════════════════
                FLOW A: SIGN IN (RETURNING ACCOUNT)
               ══════════════════════════════════════════════════════ */}
            {viewState === "signin" && (
              <div className="space-y-8 py-2">
                <div className="text-center space-y-3 max-w-md mx-auto">
                  <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-medium">
                    The Bindy Circle
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-paper-light font-light">
                    Welcome to <span className="italic font-serif">BINDY.</span>
                  </h3>
                  <p className="font-serif italic text-sm text-sand/75 font-light leading-relaxed">
                    Sign in to access your saved Australian wardrobe receipts, delivery addresses, and private previews.
                  </p>
                </div>

                <form onSubmit={handleQuickSignIn} className="space-y-4 max-w-md mx-auto">
                  <FloatingInput
                    id="signin-email"
                    label="Email Address"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (signupErrors.signinEmail) setSignupErrors({});
                    }}
                    required
                    error={signupErrors.signinEmail}
                  />

                  <FloatingInput
                    id="signin-password"
                    label="Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-3 border-t border-white/10 space-y-2">
                    <p className="text-xs font-sans text-sand/70">
                      New to BINDY Clothing?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSignupErrors({});
                        setViewState("signup-1");
                      }}
                      className="text-xs font-sans uppercase tracking-wider text-gold hover:text-white font-medium transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Create your Member Profile (3 steps)
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                FLOW B: MULTI-STEP SIGN UP (STEP 1: ACCOUNT BASICS)
               ══════════════════════════════════════════════════════ */}
            {viewState === "signup-1" && (
              <div className="space-y-6 py-2">
                {/* Step Indicator */}
                <div className="space-y-2 text-center max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-medium">
                    <span>Step 1 of 3</span>
                    <span className="text-white/20">•</span>
                    <span>Account Basics</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2 pt-1">
                    <div className="h-1 rounded-full bg-gold" />
                    <div className="h-1 rounded-full bg-white/15" />
                    <div className="h-1 rounded-full bg-white/15" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-paper-light font-light pt-2">
                    Create Your Profile
                  </h3>
                </div>

                <form onSubmit={handleNextToStep2} className="space-y-4 max-w-md mx-auto">
                  <FloatingInput
                    id="signup-name"
                    label="Full Name"
                    type="text"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (signupErrors.name) setSignupErrors((p) => ({ ...p, name: "" }));
                    }}
                    required
                    error={signupErrors.name}
                  />

                  <FloatingInput
                    id="signup-email"
                    label="Email Address"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (signupErrors.email) setSignupErrors((p) => ({ ...p, email: "" }));
                    }}
                    required
                    error={signupErrors.email}
                  />

                  <FloatingInput
                    id="signup-pass"
                    label="Create Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (signupErrors.password) setSignupErrors((p) => ({ ...p, password: "" }));
                    }}
                    required
                    error={signupErrors.password}
                  />

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue to Style Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setViewState("signin")}
                      className="text-xs font-sans text-sand/60 hover:text-gold transition-colors"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                FLOW B: MULTI-STEP SIGN UP (STEP 2: STYLE PROFILE)
               ══════════════════════════════════════════════════════ */}
            {viewState === "signup-2" && (
              <div className="space-y-6 py-2">
                {/* Step Indicator */}
                <div className="space-y-2 text-center max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-medium">
                    <span>Step 2 of 3</span>
                    <span className="text-white/20">•</span>
                    <span>Style Profile</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2 pt-1">
                    <div className="h-1 rounded-full bg-gold" />
                    <div className="h-1 rounded-full bg-gold" />
                    <div className="h-1 rounded-full bg-white/15" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-paper-light font-light pt-2">
                    Your Wardrobe Preferences
                  </h3>
                  <p className="font-serif italic text-xs text-sand/75 font-light">
                    Help us personalize your slow fashion recommendations.
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  {/* 1. Favorite Category */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                      Favorite Silhouette
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {CATEGORY_OPTIONS.map((item) => {
                        const active = prefCategory === item.category;
                        return (
                          <button
                            key={item.category}
                            type="button"
                            onClick={() => setPrefCategory(item.category)}
                            className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold/15 border-gold shadow-md"
                                : "bg-white/5 border-white/10 hover:border-white/25"
                            }`}
                          >
                            <p className={`font-serif text-sm font-medium ${active ? "text-gold" : "text-paper-light"}`}>
                              {item.category}
                            </p>
                            <p className="text-[10px] font-sans text-sand/60 mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Preferred Fit */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                      Preferred Fit Feel
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {FIT_OPTIONS.map((fit) => {
                        const active = prefFit === fit.id;
                        return (
                          <button
                            key={fit.id}
                            type="button"
                            onClick={() => setPrefFit(fit.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold/15 border-gold text-gold font-medium"
                                : "bg-white/5 border-white/10 text-sand/80 hover:border-white/25"
                            }`}
                          >
                            <p className="text-xs font-sans font-medium">{fit.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Preferred AU Size */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                      Default AU Size
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {AU_SIZES.map((sz) => {
                        const active = prefSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPrefSize(sz)}
                            className={`px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-gold text-black border-gold font-semibold shadow"
                                : "bg-white/5 border-white/10 text-sand/80 hover:border-gold/60"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setViewState("signup-1")}
                      className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-sand/70 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextToStep3}
                      className="px-6 py-3 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span>Next: Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                FLOW B: MULTI-STEP SIGN UP (STEP 3: SHIPPING ADDRESS)
               ══════════════════════════════════════════════════════ */}
            {viewState === "signup-3" && (
              <div className="space-y-6 py-2">
                {/* Step Indicator */}
                <div className="space-y-2 text-center max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-medium">
                    <span>Step 3 of 3</span>
                    <span className="text-white/20">•</span>
                    <span>Australian Delivery Address</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full grid grid-cols-3 gap-2 pt-1">
                    <div className="h-1 rounded-full bg-gold" />
                    <div className="h-1 rounded-full bg-gold" />
                    <div className="h-1 rounded-full bg-gold" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-paper-light font-light pt-2">
                    Delivery Address
                  </h3>
                  <p className="font-serif italic text-xs text-sand/75 font-light">
                    Optional: Save your shipping address for one-click checkout.
                  </p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <FloatingInput
                    id="address-street"
                    label="Street Address"
                    value={addressData.address}
                    onChange={(e) =>
                      setAddressData((a) => ({ ...a, address: e.target.value }))
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FloatingInput
                      id="address-apt"
                      label="Apt / Suite (Optional)"
                      value={addressData.apartment || ""}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, apartment: e.target.value }))
                      }
                    />

                    <FloatingInput
                      id="address-suburb"
                      label="Suburb / City"
                      value={addressData.suburb}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, suburb: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                        State / Territory
                      </label>
                      <select
                        value={addressData.state}
                        onChange={(e) =>
                          setAddressData((a) => ({ ...a, state: e.target.value }))
                        }
                        className="w-full px-3.5 py-3 rounded-xl bg-[#22201D] border border-white/15 text-paper-light text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                      >
                        {AUSTRALIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FloatingInput
                      id="address-postcode"
                      label="Postcode"
                      value={addressData.postcode}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, postcode: e.target.value }))
                      }
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleCompleteSignup(true)}
                      className="text-xs font-sans uppercase tracking-wider text-sand/60 hover:text-white underline underline-offset-4 transition-colors"
                    >
                      Skip for now, add later
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setViewState("signup-2")}
                        className="px-4 py-2.5 rounded-full border border-white/15 text-xs font-sans text-sand/80 hover:text-white"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCompleteSignup(false)}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Save & Complete</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                FLOW B: COMPLETION CELEBRATION
               ══════════════════════════════════════════════════════ */}
            {viewState === "signup-complete" && (
              <div className="py-12 text-center space-y-6 max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-16 h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                >
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </motion.div>

                <div className="space-y-2">
                  <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-medium">
                    Origins Member Created
                  </span>
                  <h3 className="font-serif text-3xl text-paper-light font-light">
                    Welcome, {account?.name}!
                  </h3>
                  <p className="font-serif italic text-sm text-sand/80 font-light leading-relaxed">
                    Your style profile has been created. Enjoy personal sizing notes and private previews.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setViewState("panel")}
                    className="px-8 py-3 rounded-full bg-gold text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-lg hover:bg-white cursor-pointer"
                  >
                    Go to My Account
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                FLOW C: SIGNED-IN ACCOUNT PANEL (4 TABBED SECTIONS)
               ══════════════════════════════════════════════════════ */}
            {viewState === "panel" && account && (
              <div className="space-y-6">
                {/* Account Masthead */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-sand/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center text-gold font-display text-xl shadow-inner select-none flex-shrink-0">
                      {getInitials(account.name)}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-paper-light font-medium leading-tight">
                        Welcome back, {account.name}
                      </h3>
                      <p className="text-xs font-sans text-sand/70 mt-0.5">
                        {account.email} {account.memberSince && `• Member since ${account.memberSince}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[11px] font-sans uppercase tracking-wider text-sand hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {/* 4 Tabs with Sliding Gold Underline */}
                <div className="flex border-b border-white/10 gap-4 sm:gap-8 overflow-x-auto pb-px">
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
                        className={`pb-3 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer relative whitespace-nowrap ${
                          active ? "text-gold" : "text-sand/60 hover:text-sand"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </span>
                        {active && (
                          <motion.div
                            layoutId="accountTabUnderline"
                            className="absolute bottom-0 inset-x-0 h-0.5 bg-gold"
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── TAB 1: PROFILE ── */}
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfileDetails} className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingInput
                        id="edit-name"
                        label="Full Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />

                      <FloatingInput
                        id="edit-email"
                        label="Email Address"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Member Benefits Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-gold text-xs font-sans uppercase tracking-wider font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Origins Circle Membership</span>
                      </div>
                      <p className="text-xs font-sans text-sand/75 font-light leading-relaxed">
                        Enjoy priority access to limited seasonal drops, private tailoring sizing notes, and carbon-neutral Australian shipping.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {isSavedFeedback === "profile" ? (
                          <>
                            <Check className="w-4 h-4 text-green-700" />
                            <span>Profile Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 2: ORDERS ── */}
                {activeTab === "orders" && (
                  <div className="space-y-4 pt-2">
                    {orders.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <Package className="w-10 h-10 text-sand/40 mx-auto" />
                        <div className="space-y-1">
                          <p className="font-serif text-lg text-paper-light font-light">
                            No orders placed yet.
                          </p>
                          <p className="text-xs font-sans text-sand/60">
                            Your handcrafted garment receipts will appear here automatically upon checkout.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            const el = document.getElementById("collection");
                            el?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-gold hover:text-black text-paper-light font-sans text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Explore Collection
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[46vh] overflow-y-auto pr-1">
                        {orders.map((ord) => (
                          <div
                            key={ord.orderRef}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-gold/40 transition-colors"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <span className="font-mono text-gold font-medium tracking-wider">
                                  #{ord.orderRef}
                                </span>
                                <span className="text-sand/50 ml-2">• {ord.date}</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-sans uppercase tracking-wider font-medium">
                                {ord.status || "Confirmed"}
                              </span>
                            </div>

                            {/* Item thumbnails */}
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                              {ord.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/5 flex-shrink-0"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-12 object-cover rounded-lg bg-black/40"
                                  />
                                  <div className="text-[11px] pr-2">
                                    <p className="font-serif text-paper-light truncate max-w-[120px]">
                                      {item.name}
                                    </p>
                                    <p className="text-[10px] font-sans text-sand/60">
                                      Size {item.size} • Qty {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-sans">
                              <span className="text-sand/60">
                                {ord.itemCount || ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                              </span>
                              <span className="font-serif text-sm font-semibold text-gold">
                                Total: ${ord.total} AUD
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
                  <form onSubmit={handleSaveAddressDetails} className="space-y-4 pt-2">
                    <FloatingInput
                      id="edit-addr-street"
                      label="Street Address"
                      value={addressData.address}
                      onChange={(e) =>
                        setAddressData((a) => ({ ...a, address: e.target.value }))
                      }
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FloatingInput
                        id="edit-addr-apt"
                        label="Apt / Suite (Optional)"
                        value={addressData.apartment || ""}
                        onChange={(e) =>
                          setAddressData((a) => ({ ...a, apartment: e.target.value }))
                        }
                      />

                      <FloatingInput
                        id="edit-addr-suburb"
                        label="Suburb / City"
                        value={addressData.suburb}
                        onChange={(e) =>
                          setAddressData((a) => ({ ...a, suburb: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          State / Territory
                        </label>
                        <select
                          value={addressData.state}
                          onChange={(e) =>
                            setAddressData((a) => ({ ...a, state: e.target.value }))
                          }
                          className="w-full px-3.5 py-3 rounded-xl bg-[#22201D] border border-white/15 text-paper-light text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        >
                          {AUSTRALIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FloatingInput
                        id="edit-addr-postcode"
                        label="Postcode"
                        value={addressData.postcode}
                        onChange={(e) =>
                          setAddressData((a) => ({ ...a, postcode: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-[11px] font-sans text-sand/60">
                        Pre-fills automatically during checkout.
                      </p>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {isSavedFeedback === "address" ? (
                          <>
                            <Check className="w-4 h-4 text-green-700" />
                            <span>Address Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Address</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 4: PREFERENCES ── */}
                {activeTab === "preferences" && (
                  <div className="space-y-6 pt-2">
                    {/* Category preference */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                        Favorite Category
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {CATEGORY_OPTIONS.map((item) => {
                          const active = prefCategory === item.category;
                          return (
                            <button
                              key={item.category}
                              type="button"
                              onClick={() => setPrefCategory(item.category)}
                              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                                active
                                  ? "bg-gold/15 border-gold shadow-md"
                                  : "bg-white/5 border-white/10 hover:border-white/25"
                              }`}
                            >
                              <p className={`font-serif text-sm font-medium ${active ? "text-gold" : "text-paper-light"}`}>
                                {item.category}
                              </p>
                              <p className="text-[10px] font-sans text-sand/60 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fit preference */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                        Preferred Fit Feel
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {FIT_OPTIONS.map((fit) => {
                          const active = prefFit === fit.id;
                          return (
                            <button
                              key={fit.id}
                              type="button"
                              onClick={() => setPrefFit(fit.id)}
                              className={`p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                active
                                  ? "bg-gold/15 border-gold text-gold font-medium"
                                  : "bg-white/5 border-white/10 text-sand/80 hover:border-white/25"
                              }`}
                            >
                              <p className="text-xs font-sans font-medium">{fit.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Size preference */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium block">
                        Default Size
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {AU_SIZES.map((sz) => {
                          const active = prefSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setPrefSize(sz)}
                              className={`px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-200 cursor-pointer ${
                                active
                                  ? "bg-gold text-black border-gold font-semibold shadow"
                                  : "bg-white/5 border-white/10 text-sand/80 hover:border-gold/60"
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-end border-t border-white/10">
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        className="px-6 py-2.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {isSavedFeedback === "preferences" ? (
                          <>
                            <Check className="w-4 h-4 text-green-700" />
                            <span>Preferences Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Preferences</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
