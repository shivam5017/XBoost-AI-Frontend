"use client";

export default function UpcomingPage() {
  return (
    <div className="max-w-5xl mx-auto py-4 space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/90 p-6 shadow-[0_18px_48px_rgba(92,100,230,0.1)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-indigo-500">Upcoming</p>
        <h1 className="mt-2 text-2xl font-bold text-[#111111]">New Modules Roadmap</h1>
        <p className="mt-2 text-sm text-slate-600">
          We are shipping new modules continuously. This section will list upcoming launches.
        </p>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-[0_10px_30px_rgba(92,100,230,0.08)]">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white grid place-items-center text-xl shadow-[0_10px_24px_rgba(99,102,241,0.25)]">
            ✨
          </div>
          <h2 className="text-lg font-semibold text-[#111111]">Nothing Scheduled Yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            No upcoming modules are published right now. As soon as roadmap items are added from admin, they will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
