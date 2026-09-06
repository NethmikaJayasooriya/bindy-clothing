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
  Phone,
  Mail,
  Lock,
  Heart,
  Copy,
  CheckCircle2,
  Clock,
  Ruler,
  Truck,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SizeGuideModal from "@/components/SizeGuideModal";
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
import { getWishlist } from "@/lib/wishlist";
import { type Category } from "@/lib/products";
import { ambientPlayer } from "@/lib/ambientSound";
import { BODY_MEASUREMENTS } from "@/data/size-guide";

const AU_SIZES = [
  "AU 4 (XXS)",
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
  { id: "true", label: "True to Size", desc: "Classic proportioned ease with natural drape" },
  { id: "relaxed", label: "Relaxed & Flowing", desc: "Breezy cut for effortless Australian warmth" },
];

const CATEGORY_OPTIONS: { category: Category; desc: string; icon: string }[] = [
  { category: "Dresses", desc: "Gathered voile, tiered linen & maxis", icon: "👗" },
  { category: "Tops & Blouses", desc: "Resort cuts, shirts & cutwork lace", icon: "👚" },
  { category: "Skirts & Pants", desc: "Fluid silks & tailored handloom linen", icon: "👖" },
  { category: "Two Piece Sets", desc: "Matching artisanal coordinates", icon: "✨" },
];

// Modern Rounded Input with Icon and Floating Label
function ModernInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  icon: Icon,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 w-full text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-mono uppercase tracking-wider text-[#78716A] font-medium"
        >
          {label} {required && <span className="text-[#C5A059]">*</span>}
        </label>
        {error && (
          <span className="text-[11px] text-red-600 font-sans flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        )}
      </div>

      <div
        className={`relative bg-white rounded-2xl border transition-all duration-200 flex items-center px-4 py-3 shadow-xs ${
          error
            ? "border-red-400 ring-2 ring-red-100"
            : "border-[#DCC7AF]/70 focus-within:border-[#C5A059] focus-within:ring-2 focus-within:ring-[#C5A059]/20"
        }`}
      >
        {Icon && <Icon className="w-4 h-4 text-[#78716A] mr-3 flex-shrink-0" />}
        <input
          id={id}
          type={actualType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#1F1E1D] placeholder:text-[#A8A29E] focus:outline-none font-sans"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#78716A] hover:text-[#1F1E1D] p-1 transition-colors flex-shrink-0 ml-2"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#C5A059]" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  // Cart & Sound state for Navbar
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Flow State
  const [authMode, setAuthMode] = useState<
    "signin" | "signup-1" | "signup-2" | "signup-3" | "signup-complete"
  >("signin");

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "address" | "preferences">("profile");

  // Sign In Form Data
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinErrors, setSigninErrors] = useState<Record<string, string>>({});

  // Sign Up Form Data
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
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
  const [editPhone, setEditPhone] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSavedFeedback, setIsSavedFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  useEffect(() => {
    setIsClient(true);
    setCartItems(getCart());
    setWishlistItems(getWishlist());

    const syncAccountData = () => {
      const acc = getAccount();
      setAccount(acc);
      setOrders(getOrders());
      setWishlistItems(getWishlist());
      if (acc) {
        setEditName(acc.name);
        setEditEmail(acc.email);
        setEditPhone(acc.phone || "");
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

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── SUBMISSION HANDLERS ──

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!signinEmail.trim()) {
      errors.email = "Please enter your email address";
    } else if (!signinEmail.includes("@") || !signinEmail.includes(".")) {
      errors.email = "Please enter a valid email address";
    }

    if (!signinPassword) {
      errors.password = "Please enter your password";
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
        phone: "+61 400 123 456",
        preferences: {
          favoriteCategory: "Dresses",
          preferredFit: "true",
          preferredSize: "AU 8 (S)",
        },
        savedAddress: {
          address: "42 James Street",
          apartment: "Suite 4",
          suburb: "Fortitude Valley",
          state: "Queensland (QLD)",
          postcode: "4006",
          country: "Australia",
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
      phone: signupPhone.trim() || undefined,
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
      phone: editPhone.trim() || undefined,
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
    setSignupPhone("");
    setSigninEmail("");
    setSigninPassword("");
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText("ORIGINS10");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isClient) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between">
        <Navbar
          isMuted={isMuted}
          toggleAudio={toggleAudio}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />
        <div className="flex-1 pt-32 pb-20 px-4 max-w-xl mx-auto flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#78716A]">Loading Sanctuary...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between selection:bg-[#C5A059] selection:text-white">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* ══════════════════════════════════════════════════════
            SECTION 1: MODERN SIGN-IN & PROFILE CREATION FLOW
           ══════════════════════════════════════════════════════ */}
        {!account && authMode !== "signup-complete" && (
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* TOP PILL SWITCHER */}
            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full bg-white p-1.5 border border-[#DCC7AF]/70 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSigninErrors({});
                    setSignupErrors({});
                    setAuthMode("signin");
                  }}
                  className={`px-6 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer ${
                    authMode === "signin"
                      ? "bg-[#1F1E1D] text-white font-bold shadow-md"
                      : "text-[#78716A] hover:text-[#1F1E1D]"
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
                  className={`px-6 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer ${
                    authMode.startsWith("signup")
                      ? "bg-[#1F1E1D] text-white font-bold shadow-md"
                      : "text-[#78716A] hover:text-[#1F1E1D]"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* ── FLOW A: MODERN SIGN IN ── */}
            {authMode === "signin" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#DCC7AF]/70 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-[11px] font-mono tracking-widest uppercase font-semibold">
                    <Sparkle className="w-3 h-3" />
                    <span>Origins Circle Sanctuary</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] font-normal leading-tight">
                    Welcome to BINDY.
                  </h1>
                  <p className="font-serif italic text-sm sm:text-base text-[#78716A] max-w-sm mx-auto leading-relaxed">
                    Access your handcrafted garment orders, tailoring preferences, and private collection releases.
                  </p>
                </div>

                <form noValidate onSubmit={handleSignIn} className="space-y-4">
                  <ModernInput
                    id="signin-email"
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    value={signinEmail}
                    onChange={(e) => {
                      setSigninEmail(e.target.value);
                      if (signinErrors.email) setSigninErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="e.g. maya@example.com.au"
                    error={signinErrors.email}
                    required
                  />

                  <ModernInput
                    id="signin-password"
                    label="Password"
                    type="password"
                    icon={Lock}
                    value={signinPassword}
                    onChange={(e) => {
                      setSigninPassword(e.target.value);
                      if (signinErrors.password) setSigninErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Enter your password"
                    error={signinErrors.password}
                    required
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-[#DCC7AF]/30 space-y-3">
                    <p className="text-xs text-[#78716A]">New to BINDY ethical slow fashion?</p>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup-1")}
                      className="text-xs font-mono uppercase tracking-wider text-[#C5A059] hover:underline font-semibold"
                    >
                      Join Origins Circle (3 Quick Steps)
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <Link
                      href="/"
                      className="text-xs text-[#78716A] hover:text-[#1F1E1D] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Continue as guest • Return to shopping</span>
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── FLOW B: 3-STEP PROFILE CREATION ── */}
            {authMode.startsWith("signup") && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#DCC7AF]/70 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-8"
              >
                {/* MODERN INTERACTIVE STEPPER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between max-w-sm mx-auto">
                    {[
                      { step: "signup-1", num: 1, label: "Account" },
                      { step: "signup-2", num: 2, label: "Fit & Style" },
                      { step: "signup-3", num: 3, label: "Delivery" },
                    ].map((s, idx) => {
                      const isActive = authMode === s.step;
                      const isDone =
                        (s.num === 1 && (authMode === "signup-2" || authMode === "signup-3")) ||
                        (s.num === 2 && authMode === "signup-3");

                      return (
                        <div key={s.num} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all ${
                                isDone
                                  ? "bg-[#AFC8B1]/40 text-[#2E4A32] border border-[#AFC8B1]"
                                  : isActive
                                  ? "bg-[#1F1E1D] text-white shadow-md ring-4 ring-[#C5A059]/20"
                                  : "bg-[#FAF7F2] text-[#78716A] border border-[#DCC7AF]"
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4 text-[#2E4A32]" /> : s.num}
                            </div>
                            <span
                              className={`text-[10px] font-mono tracking-wider uppercase mt-1 ${
                                isActive ? "text-[#1F1E1D] font-bold" : "text-[#78716A]"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                          {idx < 2 && (
                            <div
                              className={`w-12 sm:w-20 h-0.5 mx-2 -mt-4 transition-colors ${
                                isDone ? "bg-[#AFC8B1]" : "bg-[#DCC7AF]/40"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 1: ESSENTIALS */}
                {authMode === "signup-1" && (
                  <form noValidate onSubmit={handleNextToStep2} className="space-y-5">
                    <div className="text-center space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
                        Personal Essentials
                      </h2>
                      <p className="text-xs text-[#78716A]">
                        Create your private login to save tailored sizing notes.
                      </p>
                    </div>

                    <ModernInput
                      id="signup-name"
                      label="Full Name"
                      icon={User}
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        if (signupErrors.name) setSignupErrors((p) => ({ ...p, name: "" }));
                      }}
                      placeholder="e.g. Maya Ranasinghe"
                      error={signupErrors.name}
                      required
                    />

                    <ModernInput
                      id="signup-email"
                      label="Email Address"
                      type="email"
                      icon={Mail}
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupErrors.email) setSignupErrors((p) => ({ ...p, email: "" }));
                      }}
                      placeholder="e.g. maya@example.com.au"
                      error={signupErrors.email}
                      required
                    />

                    <ModernInput
                      id="signup-password"
                      label="Create Password"
                      type="password"
                      icon={Lock}
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupErrors.password) setSignupErrors((p) => ({ ...p, password: "" }));
                      }}
                      placeholder="At least 6 characters"
                      error={signupErrors.password}
                      required
                    />

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>Continue to Style Profile</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-center text-xs text-[#78716A]">
                      Already a member?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className="text-[#C5A059] hover:underline font-semibold"
                      >
                        Sign In
                      </button>
                    </p>
                  </form>
                )}

                {/* STEP 2: FIT & STYLE PROFILE */}
                {authMode === "signup-2" && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
                        Your Tailoring &amp; Aesthetic
                      </h2>
                      <p className="text-xs text-[#78716A]">
                        We tailor garment recommendations and availability alerts to your proportions.
                      </p>
                    </div>

                    {/* SIZE SELECTOR */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold">
                          Preferred Australian Size
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSizeModal(true)}
                          className="text-[11px] font-mono text-[#C5A059] hover:underline flex items-center gap-1"
                        >
                          <Ruler className="w-3 h-3" />
                          <span>Size Guide</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {AU_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setPrefSize(size)}
                            className={`py-3 px-2 rounded-2xl border text-xs font-mono text-center transition-all ${
                              prefSize === size
                                ? "border-[#C5A059] bg-[#C5A059]/15 text-[#1F1E1D] font-bold ring-2 ring-[#C5A059]/30"
                                : "border-[#DCC7AF]/60 bg-white text-[#78716A] hover:border-[#1F1E1D]"
                            }`}
                          >
                            {size.replace("AU ", "")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* FAVORITE SILHOUETTE */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold block">
                        Favorite Silhouette
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CATEGORY_OPTIONS.map((cat) => (
                          <div
                            key={cat.category}
                            onClick={() => setPrefCategory(cat.category)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                              prefCategory === cat.category
                                ? "border-[#C5A059] bg-[#C5A059]/10 shadow-xs"
                                : "border-[#DCC7AF]/60 bg-white hover:border-[#C5A059]"
                            }`}
                          >
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-serif font-medium text-[#1F1E1D]">
                                {cat.category}
                              </p>
                              <p className="text-[11px] text-[#78716A] truncate">{cat.desc}</p>
                            </div>
                            {prefCategory === cat.category && (
                              <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FIT CONSENSUS */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold block">
                        Fit Preference
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {FIT_OPTIONS.map((fit) => (
                          <button
                            key={fit.id}
                            type="button"
                            onClick={() => setPrefFit(fit.id)}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              prefFit === fit.id
                                ? "border-[#1F1E1D] bg-[#1F1E1D] text-white shadow-sm"
                                : "border-[#DCC7AF]/60 bg-white text-[#78716A] hover:border-[#C5A059]"
                            }`}
                          >
                            <span className="block text-xs font-medium">{fit.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup-1")}
                        className="w-1/3 py-3.5 rounded-full border border-[#DCC7AF] text-xs font-mono uppercase tracking-wider hover:border-[#1F1E1D]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup-3")}
                        className="w-2/3 py-3.5 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-widest font-medium transition-colors shadow-md flex items-center justify-center space-x-1"
                      >
                        <span>Continue to Delivery</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: AUSTRALIAN DELIVERY ADDRESS */}
                {authMode === "signup-3" && (
                  <div className="space-y-5">
                    <div className="text-center space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
                        Delivery &amp; Courier Details
                      </h2>
                      <p className="text-xs text-[#78716A]">
                        Speed up checkout with pre-saved Australian shipping details.
                      </p>
                    </div>

                    <ModernInput
                      id="signup-address"
                      label="Street Address"
                      icon={MapPin}
                      value={addressData.address}
                      onChange={(e) => {
                        setAddressData((p) => ({ ...p, address: e.target.value }));
                        if (addressErrors.address) setAddressErrors((p) => ({ ...p, address: "" }));
                      }}
                      placeholder="e.g. 42 James Street"
                      error={addressErrors.address}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ModernInput
                        id="signup-apt"
                        label="Apartment / Suite (Optional)"
                        value={addressData.apartment || ""}
                        onChange={(e) => setAddressData((p) => ({ ...p, apartment: e.target.value }))}
                        placeholder="e.g. Apt 4B"
                      />

                      <ModernInput
                        id="signup-suburb"
                        label="Suburb / City"
                        value={addressData.suburb}
                        onChange={(e) => {
                          setAddressData((p) => ({ ...p, suburb: e.target.value }));
                          if (addressErrors.suburb) setAddressErrors((p) => ({ ...p, suburb: "" }));
                        }}
                        placeholder="e.g. Fortitude Valley"
                        error={addressErrors.suburb}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#78716A] font-medium">
                          State / Territory
                        </label>
                        <select
                          value={addressData.state}
                          onChange={(e) => setAddressData((p) => ({ ...p, state: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-[#DCC7AF]/70 rounded-2xl text-xs font-sans text-[#1F1E1D] focus:outline-none focus:border-[#C5A059]"
                        >
                          {AUSTRALIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <ModernInput
                        id="signup-postcode"
                        label="Postcode"
                        value={addressData.postcode}
                        onChange={(e) => {
                          setAddressData((p) => ({ ...p, postcode: e.target.value }));
                          if (addressErrors.postcode) setAddressErrors((p) => ({ ...p, postcode: "" }));
                        }}
                        placeholder="e.g. 4006"
                        error={addressErrors.postcode}
                      />
                    </div>

                    <ModernInput
                      id="signup-phone"
                      label="Mobile Phone (For courier SMS notifications)"
                      icon={Phone}
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="e.g. +61 400 123 456"
                    />

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => handleCompleteSignup(true)}
                        className="w-1/3 py-3.5 rounded-full border border-[#DCC7AF] text-xs font-mono uppercase tracking-wider text-[#78716A] hover:text-[#1F1E1D]"
                      >
                        Skip for now
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCompleteSignup(false)}
                        className="w-2/3 py-3.5 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-widest font-medium transition-colors shadow-md"
                      >
                        Complete Profile
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* ── FLOW C: SIGNUP COMPLETE CELEBRATION SCREEN ── */}
        {authMode === "signup-complete" && account && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white border border-[#DCC7AF]/70 rounded-3xl p-8 sm:p-12 text-center shadow-[0_10px_35px_rgba(0,0,0,0.05)] space-y-8"
          >
            <div className="w-16 h-16 rounded-full bg-[#AFC8B1]/30 text-[#2E4A32] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
                MEMBERSHIP CONFIRMED
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D]">
                Welcome, {account.name}.
              </h1>
              <p className="font-serif italic text-base text-[#78716A] max-w-md mx-auto leading-relaxed">
                You are now a part of the BINDY Origins Circle. Your tailoring notes and preferences have been preserved.
              </p>
            </div>

            {/* VIP MEMBERSHIP PRIVILEGE CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F2ECE1] border border-[#DCC7AF]/80 text-left space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#78716A]">Member Tier</p>
                  <p className="font-serif text-lg text-[#1F1E1D] font-medium">Origins Circle Founding Patron</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-serif text-xs font-bold">
                  {getInitials(account.name)}
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCC7AF]/40 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">Welcome Privilege</p>
                  <p className="font-mono text-xs font-bold text-[#C5A059]">10% Off Your First Handcrafted Garment</p>
                </div>
                <button
                  type="button"
                  onClick={copyCodeToClipboard}
                  className="px-3 py-1.5 bg-white border border-[#DCC7AF] rounded-lg text-xs font-mono flex items-center space-x-1.5 hover:border-[#C5A059]"
                >
                  <span>{copiedCode ? "Copied!" : "ORIGINS10"}</span>
                  <Copy className="w-3 h-3 text-[#78716A]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className="w-full sm:w-1/2 py-3.5 bg-[#FAF7F2] border border-[#DCC7AF] rounded-full text-xs font-mono uppercase tracking-wider text-[#1F1E1D] hover:border-[#C5A059]"
              >
                View Profile Dashboard
              </button>
              <Link
                href="/collection"
                className="w-full sm:w-1/2 py-3.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-widest hover:bg-[#C5A059] transition-colors shadow-md flex items-center justify-center space-x-1"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            SECTION 2: MODERN SIGNED-IN PROFILE DASHBOARD
           ══════════════════════════════════════════════════════ */}
        {account && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* WELCOME BANNER & PROFILE STATS */}
            <div className="bg-white border border-[#DCC7AF]/70 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left: Avatar & Identity */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FAF7F2] to-[#DCC7AF]/50 border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-serif text-2xl font-normal shadow-sm">
                    {getInitials(account.name)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
                        Ayubowan, {account.name}
                      </h1>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-[10px] font-mono tracking-wider uppercase font-semibold">
                        <Sparkle className="w-3 h-3" /> Origins Circle
                      </span>
                    </div>
                    <p className="text-xs text-[#78716A] mt-0.5">
                      Member since {account.memberSince || "September 2026"} • {account.email}
                    </p>
                  </div>
                </div>

                {/* Right: Quick Metric Cards */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div
                    onClick={() => setActiveTab("orders")}
                    className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/50 cursor-pointer hover:border-[#C5A059] transition-colors"
                  >
                    <span className="block font-serif text-xl text-[#1F1E1D] font-medium">
                      {orders.length}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">Orders</span>
                  </div>

                  <Link
                    href="/collection"
                    className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/50 hover:border-[#C5A059] transition-colors block"
                  >
                    <span className="block font-serif text-xl text-[#1F1E1D] font-medium">
                      {wishlistItems.length}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">Saved</span>
                  </Link>

                  <div
                    onClick={() => setActiveTab("preferences")}
                    className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/50 cursor-pointer hover:border-[#C5A059] transition-colors"
                  >
                    <span className="block font-serif text-xl text-[#C5A059] font-medium truncate">
                      {account.preferences?.preferredSize?.replace("AU ", "") || "AU 8"}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">Your Fit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE-OPTIMIZED HORIZONTAL TAB BAR */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
              {[
                { id: "profile", label: "Personal Profile", icon: User },
                { id: "orders", label: `Orders (${orders.length})`, icon: Package },
                { id: "address", label: "Delivery Address", icon: MapPin },
                { id: "preferences", label: "Fit & Style", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-3 rounded-full text-xs font-mono uppercase tracking-wider flex items-center space-x-2 whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#1F1E1D] text-white shadow-md font-semibold"
                        : "bg-white border border-[#DCC7AF]/60 text-[#78716A] hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C5A059]" : ""}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 ml-auto whitespace-nowrap flex items-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="bg-white border border-[#DCC7AF]/70 rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              
              {/* TAB 1: PERSONAL PROFILE */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfileDetails} className="space-y-6 max-w-xl">
                  <div>
                    <h2 className="font-serif text-2xl text-[#1F1E1D]">Profile Details</h2>
                    <p className="text-xs text-[#78716A]">
                      Manage your personal identity and correspondence email for order updates.
                    </p>
                  </div>

                  <ModernInput
                    id="edit-name"
                    label="Full Name"
                    icon={User}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    error={profileErrors.name}
                    required
                  />

                  <ModernInput
                    id="edit-email"
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    error={profileErrors.email}
                    required
                  />

                  <ModernInput
                    id="edit-phone"
                    label="Contact Phone (Optional)"
                    icon={Phone}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +61 400 123 456"
                  />

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#1F1E1D]">Password &amp; Security</p>
                      <p className="text-[11px] text-[#78716A]">Your password was set when joining Origins Circle.</p>
                    </div>
                    <span className="text-xs font-mono text-[#C5A059] font-medium">••••••••</span>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C5A059] transition-colors shadow-md flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    {isSavedFeedback === "profile" && (
                      <span className="text-xs text-[#2E4A32] font-mono flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Profile updated successfully</span>
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 2: ORDER HISTORY */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-[#1F1E1D]">Order History &amp; Tracking</h2>
                    <p className="text-xs text-[#78716A]">
                      View receipts, garment tracking, and initiate instant returns or exchanges.
                    </p>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div
                          key={ord.orderRef}
                          className="p-5 sm:p-6 rounded-2xl border border-[#DCC7AF]/60 bg-[#FAF7F2]/50 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCC7AF]/30">
                            <div>
                              <span className="font-mono text-xs font-bold text-[#1F1E1D]">
                                {ord.orderRef}
                              </span>
                              <span className="text-xs text-[#78716A] ml-3">{ord.date}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#AFC8B1]/30 text-[#2E4A32] font-semibold">
                                {ord.status || "Confirmed"}
                              </span>
                              <span className="font-serif text-base font-semibold text-[#1F1E1D]">
                                ${ord.total} AUD
                              </span>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="space-y-2">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 text-xs">
                                <div className="w-10 h-12 bg-white rounded-lg border border-[#DCC7AF]/40 overflow-hidden flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-serif text-sm text-[#1F1E1D] truncate">{item.name}</p>
                                  <p className="text-[11px] text-[#78716A]">
                                    Size {item.size} • Qty {item.quantity} • ${item.priceAud} AUD
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                            <Link
                              href={`/returns/start?order=${ord.orderRef}`}
                              className="text-xs font-mono text-[#78716A] hover:text-[#C5A059] flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Exchange / Return Item</span>
                            </Link>

                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => alert(`Receipt for ${ord.orderRef} downloaded.`)}
                                className="px-4 py-1.5 bg-white border border-[#DCC7AF] rounded-full text-xs font-mono text-[#1F1E1D] hover:border-[#C5A059]"
                              >
                                Invoice PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* EMPTY ORDER STATE */
                    <div className="py-16 text-center space-y-4 bg-[#FAF7F2] rounded-3xl p-8 border border-[#DCC7AF]/40">
                      <div className="w-12 h-12 rounded-full bg-white border border-[#DCC7AF] flex items-center justify-center mx-auto text-[#C5A059]">
                        <Package className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-xl text-[#1F1E1D]">No Orders Yet</h3>
                      <p className="text-xs text-[#78716A] max-w-sm mx-auto leading-relaxed">
                        Your handcrafted wardrobe story awaits. Discover our limited-batch Sri Lankan collections.
                      </p>
                      <Link
                        href="/collection"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C5A059] transition-colors"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DELIVERY ADDRESS */}
              {activeTab === "address" && (
                <form onSubmit={handleSaveAddressDetails} className="space-y-6 max-w-xl">
                  <div>
                    <h2 className="font-serif text-2xl text-[#1F1E1D]">Default Shipping Address</h2>
                    <p className="text-xs text-[#78716A]">
                      Your default delivery destination for carbon-neutral Australian shipping.
                    </p>
                  </div>

                  <ModernInput
                    id="addr-street"
                    label="Street Address"
                    icon={MapPin}
                    value={addressData.address}
                    onChange={(e) => setAddressData((p) => ({ ...p, address: e.target.value }))}
                    placeholder="e.g. 42 James Street"
                    error={addressErrors.address}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ModernInput
                      id="addr-apt"
                      label="Apartment / Suite"
                      value={addressData.apartment || ""}
                      onChange={(e) => setAddressData((p) => ({ ...p, apartment: e.target.value }))}
                      placeholder="e.g. Suite 4"
                    />

                    <ModernInput
                      id="addr-suburb"
                      label="Suburb / City"
                      value={addressData.suburb}
                      onChange={(e) => setAddressData((p) => ({ ...p, suburb: e.target.value }))}
                      placeholder="e.g. Fortitude Valley"
                      error={addressErrors.suburb}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#78716A] font-medium">
                        State / Territory
                      </label>
                      <select
                        value={addressData.state}
                        onChange={(e) => setAddressData((p) => ({ ...p, state: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#DCC7AF]/70 rounded-2xl text-xs font-sans text-[#1F1E1D] focus:outline-none focus:border-[#C5A059]"
                      >
                        {AUSTRALIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <ModernInput
                      id="addr-postcode"
                      label="Postcode"
                      value={addressData.postcode}
                      onChange={(e) => setAddressData((p) => ({ ...p, postcode: e.target.value }))}
                      placeholder="e.g. 4006"
                      error={addressErrors.postcode}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C5A059] transition-colors shadow-md flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Address</span>
                    </button>
                    {isSavedFeedback === "address" && (
                      <span className="text-xs text-[#2E4A32] font-mono flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Address saved</span>
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 4: FIT & STYLE PREFERENCES */}
              {activeTab === "preferences" && (
                <div className="space-y-8 max-w-xl">
                  <div>
                    <h2 className="font-serif text-2xl text-[#1F1E1D]">Fit &amp; Sizing Profile</h2>
                    <p className="text-xs text-[#78716A]">
                      We pre-select your preferred size on every garment page for effortless ordering.
                    </p>
                  </div>

                  {/* SIZING SELECTION */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold">
                        Your Tailoring Size
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSizeModal(true)}
                        className="text-[11px] font-mono text-[#C5A059] hover:underline flex items-center gap-1"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>View Measurements Table</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {AU_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setPrefSize(size)}
                          className={`py-3 px-2 rounded-2xl border text-xs font-mono text-center transition-all ${
                            prefSize === size
                              ? "border-[#C5A059] bg-[#C5A059]/15 text-[#1F1E1D] font-bold ring-2 ring-[#C5A059]/30"
                              : "border-[#DCC7AF]/60 bg-white text-[#78716A] hover:border-[#1F1E1D]"
                          }`}
                        >
                          {size.replace("AU ", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SILHOUETTE PREFERENCE */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold block">
                      Favorite Garment Silhouette
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <div
                          key={cat.category}
                          onClick={() => setPrefCategory(cat.category)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                            prefCategory === cat.category
                              ? "border-[#C5A059] bg-[#C5A059]/10 shadow-xs"
                              : "border-[#DCC7AF]/60 bg-white hover:border-[#C5A059]"
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-serif font-medium text-[#1F1E1D]">
                              {cat.category}
                            </p>
                            <p className="text-[11px] text-[#78716A] truncate">{cat.desc}</p>
                          </div>
                          {prefCategory === cat.category && (
                            <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FIT CONSENSUS */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold block">
                      Preferred Fit Feel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FIT_OPTIONS.map((fit) => (
                        <button
                          key={fit.id}
                          type="button"
                          onClick={() => setPrefFit(fit.id)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            prefFit === fit.id
                              ? "border-[#1F1E1D] bg-[#1F1E1D] text-white shadow-sm"
                              : "border-[#DCC7AF]/60 bg-white text-[#78716A] hover:border-[#C5A059]"
                          }`}
                        >
                          <span className="block text-xs font-medium">{fit.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="px-8 py-3.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C5A059] transition-colors shadow-md flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </button>
                    {isSavedFeedback === "preferences" && (
                      <span className="text-xs text-[#2E4A32] font-mono flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Fit notes saved</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer />

      {/* SIZE GUIDE MODAL */}
      <SizeGuideModal
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </main>
  );
}
