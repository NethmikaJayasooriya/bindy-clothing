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
  ShieldCheck,
  CreditCard,
  Edit2,
  Save,
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
} from "@/lib/account";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "orders">("details");

  // Sign In / Register Form State
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  // Edit Address Form State
  const [editAddress, setEditAddress] = useState<SavedAddress>({
    address: "",
    apartment: "",
    suburb: "",
    state: "Queensland (QLD)",
    postcode: "",
    country: "Australia",
  });
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Sync state on open and subscriptions
  useEffect(() => {
    const update = () => {
      const acc = getAccount();
      setAccount(acc);
      setOrders(getOrders());
      if (acc) {
        setEditName(acc.name);
        setEditEmail(acc.email);
        if (acc.savedAddress) {
          setEditAddress(acc.savedAddress);
        }
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

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSavedFeedback(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handlers
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    const newAcc: UserAccount = {
      name: nameInput.trim(),
      email: emailInput.trim().toLowerCase(),
    };
    saveAccount(newAcc);
    setAccount(newAcc);
    setEditName(newAcc.name);
    setEditEmail(newAcc.email);
    setNameInput("");
    setEmailInput("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const updated: UserAccount = {
      ...account,
      name: editName.trim() || account.name,
      email: editEmail.trim().toLowerCase() || account.email,
      savedAddress: editAddress,
    };
    saveAccount(updated);
    setAccount(updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  const handleSignOut = () => {
    clearAccount();
    setAccount(null);
    setActiveTab("details");
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
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-[#171614] border border-sand/30 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-sand hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ── 1. SIGNED-OUT VIEW: LOGIN / REGISTER ── */}
            {!account ? (
              <div className="space-y-8 py-4">
                <div className="text-center space-y-3 max-w-md mx-auto">
                  <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-medium">
                    The Bindy Circle
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-paper-light font-light">
                    Welcome to <span className="italic font-serif">BINDY.</span>
                  </h3>
                  <p className="font-serif italic text-sm text-sand/75 font-light leading-relaxed">
                    Join or sign in to save your Australian delivery address, view order receipts, and access private previews.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Maya Ranasinghe"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-sm font-sans focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans uppercase tracking-wider text-sand/80 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. maya@example.com.au"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-sm font-sans focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-center text-[11px] font-sans text-sand/50 pt-2 font-light">
                    Demo Account • Instant local sign-in with no password required
                  </p>
                </form>
              </div>
            ) : (
              /* ── 2. SIGNED-IN VIEW: PROFILE & ORDER HISTORY ── */
              <div className="space-y-6">
                {/* Account Masthead */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sand/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-display text-xl shadow-inner select-none">
                      {getInitials(account.name)}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-paper-light font-medium leading-tight">
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

                {/* Tabs */}
                <div className="flex border-b border-white/10 gap-6">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-3 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer relative ${
                      activeTab === "details"
                        ? "text-gold"
                        : "text-sand/60 hover:text-sand"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Shipping Address</span>
                    </span>
                    {activeTab === "details" && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-gold"
                      />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`pb-3 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer relative ${
                      activeTab === "orders"
                        ? "text-gold"
                        : "text-sand/60 hover:text-sand"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5" />
                      <span>Order History ({orders.length})</span>
                    </span>
                    {activeTab === "orders" && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-gold"
                      />
                    )}
                  </button>
                </div>

                {/* ── TAB 1: SHIPPING ADDRESS & PROFILE ── */}
                {activeTab === "details" && (
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={editAddress.address}
                        onChange={(e) =>
                          setEditAddress((a) => ({ ...a, address: e.target.value }))
                        }
                        placeholder="e.g. 42 James Street"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          Apartment / Suite
                        </label>
                        <input
                          type="text"
                          value={editAddress.apartment || ""}
                          onChange={(e) =>
                            setEditAddress((a) => ({ ...a, apartment: e.target.value }))
                          }
                          placeholder="Apt 4B (optional)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          Suburb / City
                        </label>
                        <input
                          type="text"
                          value={editAddress.suburb}
                          onChange={(e) =>
                            setEditAddress((a) => ({ ...a, suburb: e.target.value }))
                          }
                          placeholder="New Farm"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={editAddress.postcode}
                          onChange={(e) =>
                            setEditAddress((a) => ({ ...a, postcode: e.target.value }))
                          }
                          placeholder="4005"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper-light placeholder:text-sand/30 text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-sans uppercase tracking-wider text-sand/70">
                        State / Territory
                      </label>
                      <select
                        value={editAddress.state}
                        onChange={(e) =>
                          setEditAddress((a) => ({ ...a, state: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201D] border border-white/15 text-paper-light text-xs font-sans focus:outline-none focus:border-gold transition-colors"
                      >
                        {AUSTRALIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-[11px] font-sans text-sand/60">
                        Saved details automatically pre-fill your checkout.
                      </p>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-gold hover:bg-white text-black font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {isSavedFeedback ? (
                          <>
                            <Check className="w-4 h-4 text-green-700" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 2: ORDER HISTORY ── */}
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
                            Your handcrafted wardrobe receipts will appear here automatically.
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
                      <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                        {orders.map((ord) => (
                          <div
                            key={ord.orderRef}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
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
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
