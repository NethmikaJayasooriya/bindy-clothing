"use client";
import { useEffect, useState } from "react";
import { Button, Field, Panel } from "./AdminUI";
import { useAdmin } from "./AdminProvider";
type Control = { enabled: boolean; renderLimit: number; used: number; dailyLimit: number; day: string; dailyUsed: number };
export default function AdminTryOn() {
  const { notify } = useAdmin();
  const [control, setControl] = useState<Control | null>(null), [configured, setConfigured] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  useEffect(() => { const controller = new AbortController(); fetch("/api/admin/tryon", { signal: controller.signal }).then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.error); setControl(data.control); setConfigured(data.configured); }).catch(e => { if (!controller.signal.aborted) setError(e.message); }); return () => controller.abort(); }, []);
  async function save() {
    if (!control) return; setBusy(true);
    try {
      const response = await fetch("/api/admin/tryon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: control.enabled, renderLimit: control.renderLimit, dailyLimit: control.dailyLimit }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setControl(data.control); notify("Fitting-room settings saved.");
    } catch (e) { notify((e as Error).message, true); } finally { setBusy(false); }
  }
  return <Panel title="Virtual fitting room" description="Create one complete outfit from the selected top and bottom. Completed previews are saved and reused without another render.">
    <div className="admin-panel-body">
      {error && <p role="alert">{error}</p>}
      {!control && !error && <p role="status">Loading fitting-room settings…</p>}
      {control && <>
        <p className="admin-note">{control.used} render attempts used · {Math.max(0, control.renderLimit-control.used)} remaining in your store limit. This is a store spending control, not the FAL credit balance. Check your FAL account before increasing it.</p>
        <div className="admin-form-grid">
          <label className="admin-check wide"><input type="checkbox" disabled={!configured} checked={control.enabled} onChange={e => setControl({ ...control, enabled: e.target.checked })}/>Automatically create new outfit previews</label>
          <Field label="Total render limit" hint="Maximum paid attempts since setup. Existing completed previews remain available when new renders are paused."><input type="number" min={control.used} max={10000} value={control.renderLimit} onChange={e => setControl({ ...control, renderLimit: Number(e.target.value) })}/></Field>
          <Field label="Daily render limit" hint="A second limit for new attempts each UTC day."><input type="number" min={1} max={200} value={control.dailyLimit} onChange={e => setControl({ ...control, dailyLimit: Number(e.target.value) })}/></Field>
        </div>
        {!configured && <p className="admin-note">The server fitting-service key needs to be configured in Vercel.</p>}
        <p className="admin-muted" style={{ margin: "18px 0" }}>Updated product photographs create a fresh preview. AI previews illustrate styling; product photographs and size guides remain the source for garment details and fit. Unsuccessful service attempts can still consume credit.</p>
        <Button variant="primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save fitting-room settings"}</Button>
      </>}
    </div>
  </Panel>;
}
