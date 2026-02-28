"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import type { TweetTemplate, PromptConfig, ModuleConfig, PlanId } from "@/utils/api";

// ── Icons ─────────────────────────────────────────────────────────────────────

const TemplatesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PromptsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ModulesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l7 4v6l-7 4L1 11V5l7-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 1v14M1 5l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2.5l2 2L4 12H2v-2l7.5-7.5zM8.5 3.5l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
    <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 8h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
    <path d="M2 2h8l2 2v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 2v4h4V2M4 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Spinner = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <div className={`${className} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
);

// ── Target + Plan badge helpers ───────────────────────────────────────────────

const TARGET_COLORS: Record<string, string> = {
  tweet: "bg-sky-50 text-sky-600 border-sky-200",
  reply: "bg-violet-50 text-violet-600 border-violet-200",
  both: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-50 text-gray-500 border-gray-200",
  starter: "bg-indigo-50 text-indigo-600 border-indigo-200",
  pro: "bg-violet-50 text-violet-600 border-violet-200",
};

const AVAIL_COLORS: Record<string, string> = {
  live: "bg-emerald-50 text-emerald-600 border-emerald-200",
  coming_soon: "bg-orange-50 text-orange-500 border-orange-200",
};

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>
      {label}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function RowSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-gray-50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-100 rounded animate-pulse w-1/3" />
            <div className="h-2.5 bg-gray-50 rounded animate-pulse w-2/3" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">{title}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Form field helpers ────────────────────────────────────────────────────────

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";

const selectClass =
  "w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-indigo-500" : "bg-gray-200"}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-4" : ""}`} />
      </div>
      <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">{label}</span>
    </label>
  );
}

// ── TEMPLATES ────────────────────────────────────────────────────────────────

type TemplateForm = {
  slug: string; label: string; emoji: string; instruction: string;
  structure: string; example: string; category: string;
  target: "tweet" | "reply" | "both"; isActive: boolean; sortOrder: number;
};

const emptyTemplate: TemplateForm = {
  slug: "", label: "", emoji: "🧩", instruction: "",
  structure: "", example: "", category: "general",
  target: "both", isActive: true, sortOrder: 0,
};

function TemplateModal({
  initial, onClose, onSaved,
}: { initial?: TweetTemplate | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<TemplateForm>(
    initial
      ? { ...initial, structure: initial.structure ?? "", example: initial.example ?? "", sortOrder: initial.sortOrder ?? 0 }
      : emptyTemplate,
  );
  const [saving, setSaving] = useState(false);

  const set = (k: keyof TemplateForm, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.slug || !form.label || !form.instruction) {
      toast.error("Slug, label, and instruction are required");
      return;
    }
    setSaving(true);
    try {
      await api.admin.saveTemplate({
        slug: form.slug, label: form.label, emoji: form.emoji,
        instruction: form.instruction, structure: form.structure || undefined,
        example: form.example || undefined, category: form.category,
        target: form.target, isActive: form.isActive, sortOrder: form.sortOrder,
      });
      toast.success(initial ? "Template updated" : "Template created");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={initial ? `Edit — ${initial.label}` : "New Template"} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Slug" required hint="lowercase, a-z 0-9 _ -">
            <input className={inputClass} value={form.slug} placeholder="my_template"
              onChange={e => set("slug", e.target.value)} disabled={!!initial} />
          </Field>
          <Field label="Emoji">
            <input className={inputClass} value={form.emoji} placeholder="🧩" maxLength={8}
              onChange={e => set("emoji", e.target.value)} />
          </Field>
        </div>

        <Field label="Label" required>
          <input className={inputClass} value={form.label} placeholder="Template name"
            onChange={e => set("label", e.target.value)} />
        </Field>

        <Field label="Instruction" required hint="Injected into AI prompt">
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.instruction}
            placeholder="Describe how the AI should generate content..."
            onChange={e => set("instruction", e.target.value)} />
        </Field>

        <Field label="Structure" hint="Optional pattern / scaffold">
          <textarea className={`${inputClass} resize-none font-mono`} rows={3} value={form.structure}
            placeholder="[Hook]\n\n[Body]\n\n[CTA]"
            onChange={e => set("structure", e.target.value)} />
        </Field>

        <Field label="Example" hint="Sample output shown to AI">
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.example}
            placeholder="Example tweet or reply..."
            onChange={e => set("example", e.target.value)} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Category">
            <input className={inputClass} value={form.category} placeholder="general"
              onChange={e => set("category", e.target.value)} />
          </Field>
          <Field label="Target">
            <select className={selectClass} value={form.target} onChange={e => set("target", e.target.value as any)}>
              <option value="both">Both</option>
              <option value="tweet">Tweet</option>
              <option value="reply">Reply</option>
            </select>
          </Field>
          <Field label="Sort Order">
            <input type="number" className={inputClass} value={form.sortOrder} min={0} max={10000}
              onChange={e => set("sortOrder", Number(e.target.value))} />
          </Field>
        </div>

        <Toggle checked={form.isActive} onChange={v => set("isActive", v)} label="Active (visible to users)" />

        <div className="pt-2 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-colors">
            {saving ? <Spinner /> : <SaveIcon />}
            {saving ? "Saving…" : "Save Template"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TemplatesPanel() {
  const [templates, setTemplates] = useState<TweetTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | TweetTemplate | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setTemplates(await api.admin.templates()); } catch { toast.error("Failed to load templates"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (slug: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    setDeleting(slug);
    try {
      await api.admin.removeTemplate(slug);
      toast.success("Template deleted");
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    } finally { setDeleting(null); }
  };

  const filtered = templates.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.includes(search.toLowerCase()) ||
    t.category.includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <input className={`${inputClass} max-w-xs`} placeholder="Search templates…" value={search}
          onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setModal("create")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white transition-colors shrink-0">
          <PlusIcon /> New Template
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          {["", "Label / Slug", "Category", "Target", ""].map((h, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? <RowSkeleton /> : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-300">No templates found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(t => (
              <div key={t.slug} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-3.5 items-center hover:bg-gray-50/50 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg leading-none">
                  {t.emoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800 truncate">{t.label}</span>
                    {!t.isActive && (
                      <span className="text-[9px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">HIDDEN</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{t.slug}</span>
                </div>
                <Badge label={t.category} colorClass="bg-gray-50 text-gray-500 border-gray-200" />
                <Badge label={t.target} colorClass={TARGET_COLORS[t.target]} />
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(t)}
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-500 transition-colors">
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDelete(t.slug, t.label)} disabled={deleting === t.slug}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors disabled:opacity-50">
                    {deleting === t.slug ? <Spinner className="w-3.5 h-3.5 border-red-300 border-t-red-500" /> : <TrashIcon />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal === "create" && (
        <TemplateModal onClose={() => setModal(null)} onSaved={load} />
      )}
      {modal && modal !== "create" && (
        <TemplateModal initial={modal as TweetTemplate} onClose={() => setModal(null)} onSaved={load} />
      )}
    </>
  );
}

// ── PROMPT CONFIGS ────────────────────────────────────────────────────────────

function PromptConfigModal({
  item, onClose, onSaved,
}: { item: PromptConfig; onClose: () => void; onSaved: () => void }) {
  const [value, setValue] = useState(item.value);
  const [description, setDescription] = useState(item.description ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) { toast.error("Value is required"); return; }
    setSaving(true);
    try {
      await api.admin.savePrompt(item.key, value, description || undefined);
      toast.success("Prompt config saved");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <Modal title={`Edit — ${item.key}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Key">
          <input className={`${inputClass} bg-gray-50 font-mono text-gray-400`} value={item.key} disabled />
        </Field>
        <Field label="Description">
          <input className={inputClass} value={description} placeholder="What this config controls…"
            onChange={e => setDescription(e.target.value)} />
        </Field>
        <Field label="Value" required hint="Injected into AI system prompt at runtime">
          <textarea className={`${inputClass} resize-none font-mono`} rows={8} value={value}
            onChange={e => setValue(e.target.value)} />
        </Field>
        <div className="pt-2 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-colors">
            {saving ? <Spinner /> : <SaveIcon />}
            {saving ? "Saving…" : "Save Config"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PromptsPanel() {
  const [configs, setConfigs] = useState<PromptConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PromptConfig | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setConfigs(await api.admin.prompts()); } catch { toast.error("Failed to load prompt configs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-400">
          Prompt configs are injected at runtime into AI generation. Changes take effect immediately.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_auto] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          {["Key", "Description / Preview", ""].map((h, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? <RowSkeleton rows={4} /> : configs.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-300">No prompt configs found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {configs.map(c => (
              <div key={c.key} className="grid grid-cols-[1fr_2fr_auto] gap-3 px-4 py-3.5 items-center hover:bg-gray-50/50 transition-colors group">
                <code className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded-lg truncate">
                  {c.key}
                </code>
                <div className="min-w-0">
                  {c.description && (
                    <div className="text-xs font-medium text-gray-700 mb-0.5 truncate">{c.description}</div>
                  )}
                  <div className="text-[10px] text-gray-400 truncate font-mono">
                    {c.value.substring(0, 80)}{c.value.length > 80 ? "…" : ""}
                  </div>
                </div>
                <button onClick={() => setEditing(c)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-500 transition-all">
                  <EditIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <PromptConfigModal item={editing} onClose={() => setEditing(null)} onSaved={load} />
      )}
    </>
  );
}

// ── MODULE CONFIGS ────────────────────────────────────────────────────────────

function ModuleModal({
  item, onClose, onSaved,
}: { item: ModuleConfig; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item.name ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [availability, setAvailability] = useState<"live" | "coming_soon" | "">(item.availability ?? "");
  const [minimumPlan, setMinimumPlan] = useState<PlanId | "">(item.minimumPlan ?? "");
  const [isVisible, setIsVisible] = useState(item.isVisible);
  const [promptHint, setPromptHint] = useState(item.promptHint ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.admin.saveModule(item.id, {
        name: name || null,
        description: description || null,
        availability: availability || undefined,
        minimumPlan: minimumPlan || undefined,
        isVisible,
        promptHint: promptHint || null,
      });
      toast.success("Module config saved");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <Modal title={`Module — ${item.id}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Feature ID">
          <input className={`${inputClass} bg-gray-50 font-mono text-gray-400`} value={item.id} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Display Name">
            <input className={inputClass} value={name} placeholder="Feature name…"
              onChange={e => setName(e.target.value)} />
          </Field>
          <Field label="Minimum Plan">
            <select className={selectClass} value={minimumPlan} onChange={e => setMinimumPlan(e.target.value as PlanId)}>
              <option value="">— inherit —</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea className={`${inputClass} resize-none`} rows={2} value={description}
            placeholder="Short user-facing description…" onChange={e => setDescription(e.target.value)} />
        </Field>
        <Field label="Availability">
          <select className={selectClass} value={availability} onChange={e => setAvailability(e.target.value as any)}>
            <option value="">— unset —</option>
            <option value="live">Live</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </Field>
        <Field label="Prompt Hint" hint="Optional context injected into AI when this module is active">
          <textarea className={`${inputClass} resize-none`} rows={3} value={promptHint}
            placeholder="Additional AI context for this feature…" onChange={e => setPromptHint(e.target.value)} />
        </Field>
        <Toggle checked={isVisible} onChange={setIsVisible} label="Visible in UI" />
        <div className="pt-2 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-colors">
            {saving ? <Spinner /> : <SaveIcon />}
            {saving ? "Saving…" : "Save Module"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ModulesPanel() {
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ModuleConfig | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setModules(await api.admin.modules()); } catch { toast.error("Failed to load modules"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-400">
          Module configs control feature availability, plan gating, and AI prompt hints per feature.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          {["Feature ID", "Name", "Plan", "Availability", "Visible", ""].map((h, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? <RowSkeleton rows={5} /> : modules.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-300">No modules found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {modules.map(m => (
              <div key={m.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 px-4 py-3.5 items-center hover:bg-gray-50/50 transition-colors group">
                <code className="text-[11px] font-mono text-gray-600 truncate">{m.id}</code>
                <span className="text-xs text-gray-700 truncate">{m.name ?? <span className="text-gray-300 italic">—</span>}</span>
                {m.minimumPlan ? (
                  <Badge label={m.minimumPlan} colorClass={PLAN_COLORS[m.minimumPlan]} />
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
                {m.availability ? (
                  <Badge label={m.availability === "coming_soon" ? "soon" : "live"} colorClass={AVAIL_COLORS[m.availability]} />
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
                <div className={`w-2 h-2 rounded-full ${m.isVisible ? "bg-emerald-400" : "bg-gray-200"}`} title={m.isVisible ? "Visible" : "Hidden"} />
                <button onClick={() => setEditing(m)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-500 transition-all">
                  <EditIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <ModuleModal item={editing} onClose={() => setEditing(null)} onSaved={load} />
      )}
    </>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

type Tab = "templates" | "prompts" | "modules";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "templates", label: "Templates", icon: <TemplatesIcon /> },
  { id: "prompts",   label: "Prompt Configs", icon: <PromptsIcon /> },
  { id: "modules",   label: "Modules", icon: <ModulesIcon /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("templates");

  return (
    <div className="min-h-full p-5 bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5C2 2.67 2.67 2 3.5 2h7C11.33 2 12 2.67 12 3.5v7c0 .83-.67 1.5-1.5 1.5h-7C2.67 12 2 11.33 2 10.5v-7z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-gray-800">Admin Panel</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-9">Manage templates, AI prompts, and feature modules</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-red-500 tracking-wider">
          ADMIN ONLY
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              tab === t.id
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className={tab === t.id ? "text-white" : "text-current"}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {tab === "templates" && <TemplatesPanel />}
        {tab === "prompts"   && <PromptsPanel />}
        {tab === "modules"   && <ModulesPanel />}
      </div>
    </div>
  );
}