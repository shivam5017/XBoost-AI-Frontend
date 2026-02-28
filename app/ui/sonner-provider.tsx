"use client";

import { Toaster } from "sonner";

export default function SonnerProvider() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!border !border-indigo-100 !bg-white/95 !text-[#1a0a2e] !shadow-[0_12px_30px_rgba(91,106,247,0.14)]",
          title: "!font-semibold",
          description: "!text-slate-600",
          actionButton: "!bg-indigo-600 !text-white",
          cancelButton: "!bg-slate-100 !text-slate-700",
        },
      }}
    />
  );
}
