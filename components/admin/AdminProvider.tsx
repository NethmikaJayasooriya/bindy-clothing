"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { StoreState } from "@/lib/store-types";

interface Owner { name: string; email: string }
interface AdminContextValue { store: StoreState | null; owner: Owner | null; busy: boolean; refresh: (idleOnly?: boolean) => Promise<void>; save: (action: string, data: unknown) => Promise<unknown>; notify: (message: string, error?: boolean) => void; logout: () => Promise<void> }
const AdminContext = createContext<AdminContextValue>(null!);
export const useAdmin = () => useContext(AdminContext);
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [owner, setOwner] = useState<Owner | null>(null); const [configured, setConfigured] = useState(true); const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreState | null>(null); const [busy, setBusy] = useState(false); const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const notify = useCallback((text: string, error = false) => { setMessage({ text, error }); }, []);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(null), 6000); return () => clearTimeout(timer); }, [message]);
  const refresh = useCallback(async (idleOnly = false) => { if (idleOnly && document.querySelector("dialog[open]")) return; const response = await fetch("/api/admin/store", { cache: "no-store" }); if (response.status === 401) { setOwner(null); setStore(null); return; } if (!response.ok) throw new Error("Unable to load your store. Check your connection and try again."); const data = await response.json(); if (idleOnly && document.querySelector("dialog[open]")) return; setStore(current => !current || data.revision > current.revision ? data : current); }, []);
  const session = useCallback(async () => { setLoading(true); try { const response = await fetch("/api/admin/auth", { cache: "no-store" }); if (!response.ok) throw new Error("Unable to connect to the store."); const auth = await response.json(); setConfigured(auth.configured); setOwner(auth.owner); if (auth.owner) await refresh(); } catch (e) { notify((e as Error).message, true); } finally { setLoading(false); } }, [refresh, notify]);
  useEffect(() => { session(); }, [session]);
  const save = async (action: string, data: unknown) => {
    if (!store || busy) throw new Error("Please wait for the current update to finish."); setBusy(true);
    try { const response = await fetch("/api/admin/store", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, data, revision: store.revision }) }); const result = await response.json(); if (!response.ok) { if (response.status === 409) await refresh(); if (response.status === 401) setOwner(null); throw new Error(result.error || "Unable to save."); } setStore(current=>!current||result.state.revision>current.revision?result.state:current); notify("Changes saved successfully."); return result.result; }
    catch (e) { notify((e as Error).message, true); throw e; } finally { setBusy(false); }
  };
  const logout = async () => { await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); setOwner(null); setStore(null); };
  return <AdminContext.Provider value={{ store, owner, busy, refresh, save, notify, logout }}>
    {loading ? <div className="admin-loading"><span className="admin-spinner" /><p>Opening your store workspace…</p></div> : owner && store ? children : <AdminSignIn configured={configured} onSuccess={session} />}
    {message && <div role={message.error ? "alert" : "status"} className={`admin-toast ${message.error ? "error" : ""}`}><span>{message.text}</span><button onClick={() => setMessage(null)} aria-label="Dismiss notification">×</button></div>}
  </AdminContext.Provider>;
}
function AdminSignIn({ configured, onSuccess }: { configured: boolean; onSuccess: () => Promise<void> }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setError(""); const data = Object.fromEntries(new FormData(e.currentTarget)); try { const response = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, action: configured ? "login" : "setup" }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); await onSuccess(); } catch (e) { setError((e as Error).message || "Please try again."); } finally { setBusy(false); } }
  return <div className="admin-auth"><div className="admin-auth-art"><a href="/" className="admin-wordmark">bindy<span>.</span></a><div><p className="admin-eyebrow">YOUR STORE. YOUR SPACE.</p><h1>A little order.<br />A lot of possibility.</h1><p>Everything behind your beautiful storefront,<br />thoughtfully brought together.</p></div><span>BINDY CLOTHING · STORE ADMINISTRATION</span></div><div className="admin-auth-form"><a href="/" className="admin-back">← Back to storefront</a><div><span className="admin-kicker">BINDY ADMIN</span><h2>{configured ? "Welcome back." : "Make this space yours."}</h2><p>{configured ? "Sign in to manage your store." : "Create the owner account to start managing your store."}</p><form onSubmit={submit}>
    {!configured && <label>Your name<input name="name" autoComplete="name" required placeholder="Store owner" /></label>}
    <label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@yourstore.com" /></label>
    <label>Password<input name="password" type="password" autoComplete={configured ? "current-password" : "new-password"} required minLength={configured ? undefined : 12} maxLength={128} placeholder={configured ? "Enter your password" : "At least 12 characters"} /></label>
    {!configured && <details><summary>Have a production setup token?</summary><label>Setup token<input name="token" type="password" autoComplete="off" /></label></details>}
    {error && <div className="admin-form-error" role="alert">{error}</div>}
    <button className="admin-btn primary full" disabled={busy}>{busy ? "Please wait…" : configured ? "Sign in to your workspace →" : "Create owner account →"}</button>
  </form><p className="admin-auth-note">Protected access for your store owner. Customer accounts cannot sign in here.</p></div><small>Need access? Contact your store owner. Passwords are never shown or stored in plain text.</small></div></div>;
}
