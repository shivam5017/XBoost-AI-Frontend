"use client";

import { FormEvent, useMemo, useState } from "react";
import { api, PromptConfig, TweetTemplate } from "@/utils/api";
import { toast } from "sonner";

type TemplateForm = {
  slug: string;
  label: string;
  emoji: string;
  instruction: string;
  structure: string;
  example: string;
  category: string;
  target: "tweet" | "reply" | "both";
  sortOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: TemplateForm = {
  slug: "",
  label: "",
  emoji: "🧩",
  instruction: "",
  structure: "",
  example: "",
  category: "general",
  target: "both",
  sortOrder: 0,
  isActive: true,
};

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState("shivammalik");
  const [templates, setTemplates] = useState<TweetTemplate[]>([]);
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [form, setForm] = useState<TemplateForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.slug.trim() && form.label.trim() && form.instruction.trim()),
    [form],
  );

  const loadAdminData = async () => {
    setLoading(true);
    try {
      api.admin.setPassword(adminPassword);
      const [tpls, prm] = await Promise.all([api.admin.templates(), api.admin.prompts()]);
      setTemplates(tpls);
      setPrompts(prm);
    } catch (error: any) {
      toast.error(error?.message || "Admin auth failed");
    } finally {
      setLoading(false);
    }
  };

  const onSaveTemplate = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      api.admin.setPassword(adminPassword);
      await api.admin.saveTemplate({
        ...form,
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, "_"),
      });
      toast.success("Template saved");
      setForm(EMPTY_FORM);
      await loadAdminData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteTemplate = async (slug: string) => {
    try {
      api.admin.setPassword(adminPassword);
      await api.admin.removeTemplate(slug);
      setTemplates((prev) => prev.filter((item) => item.slug !== slug));
      toast.success("Template deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete template");
    }
  };

  const onSavePrompt = async (key: string, value: string, description?: string | null) => {
    try {
      api.admin.setPassword(adminPassword);
      await api.admin.savePrompt(key, value, description || undefined);
      toast.success(`${key} updated`);
    } catch (error: any) {
      toast.error(error?.message || `Failed to update ${key}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-5">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/90 p-6 shadow-[0_18px_48px_rgba(92,100,230,0.1)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-indigo-500">Admin Console</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#111111]">Template + Prompt Control</h1>
        <p className="mt-2 text-sm text-slate-600">
          Restricted to your admin email. Enter admin password here (default: <span className="font-semibold">shivammalik</span>) and click Unlock.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
          />
          <button
            onClick={loadAdminData}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Unlock
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-white p-5">
        <h2 className="text-lg font-bold text-[#111111]">Create or Update Template</h2>
        <form onSubmit={onSaveTemplate} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="label" value={form.label} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="emoji" value={form.emoji} onChange={(e) => setForm((s) => ({ ...s, emoji: e.target.value }))} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="category" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.target} onChange={(e) => setForm((s) => ({ ...s, target: e.target.value as TemplateForm["target"] }))}>
            <option value="both">Both</option>
            <option value="tweet">Tweet</option>
            <option value="reply">Reply</option>
          </select>
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="number" placeholder="sortOrder" value={form.sortOrder} onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) || 0 }))} />
          <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm h-20" placeholder="instruction" value={form.instruction} onChange={(e) => setForm((s) => ({ ...s, instruction: e.target.value }))} />
          <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm h-20" placeholder={"Hook: Most founders are shipping noise.\n\nSignal is what your audience repeats.\nNoise is what they scroll past."} value={form.structure} onChange={(e) => setForm((s) => ({ ...s, structure: e.target.value }))} />
          <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm h-20" placeholder={"Most creators don't need more ideas.\nThey need better distribution loops.\nWhich loop are you fixing this week?"} value={form.example} onChange={(e) => setForm((s) => ({ ...s, example: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="md:col-span-2">
            <button disabled={saving || !canSubmit} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Saving..." : "Save Template"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-white p-5">
        <h2 className="text-lg font-bold text-[#111111]">Live Templates</h2>
        {loading ? (
          <div className="mt-3 text-sm text-slate-500">Loading...</div>
        ) : (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div key={tpl.slug} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{tpl.emoji} {tpl.label}</p>
                    <p className="text-[11px] text-slate-400">{tpl.slug}</p>
                  </div>
                  <button onClick={() => onDeleteTemplate(tpl.slug)} className="text-xs text-red-500">Delete</button>
                </div>
                <p className="mt-2 text-xs text-slate-600">{tpl.instruction}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-white p-5">
        <h2 className="text-lg font-bold text-[#111111]">Prompt Config</h2>
        <p className="mt-1 text-xs text-slate-500">
          Edit global prompts and `tone_catalog_json` (valid JSON) to control tone options in compose.
        </p>
        <div className="mt-4 space-y-3">
          {prompts.map((prompt) => (
            <PromptRow key={prompt.key} prompt={prompt} onSave={onSavePrompt} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PromptRow({
  prompt,
  onSave,
}: {
  prompt: PromptConfig;
  onSave: (key: string, value: string, description?: string | null) => Promise<void>;
}) {
  const [value, setValue] = useState(prompt.value);
  const [saving, setSaving] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#111111]">{prompt.key}</p>
          {prompt.description && <p className="text-xs text-slate-500">{prompt.description}</p>}
        </div>
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(prompt.key, value, prompt.description);
            setSaving(false);
          }}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <textarea
        className="mt-2 h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
