import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans, DM_Mono } from "next/font/google";
import SonnerProvider from "./ui/sonner-provider";
import "./globals.css";

export const syne = localFont({
  src: [
    {
      path: "./fonts/syne-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/syne-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-syne",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XBoost AI",
  description: "AI copilot for creators on X.",
  icons: {
    icon: [
      { url: "/favicon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-128.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon-128.png", sizes: "128x128", type: "image/png" }],
    shortcut: ["/favicon-128.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
    bg-[#f8f7ff]/80
    ${syne.variable}
    ${dmSans.variable}
    ${dmMono.variable}
    ${dmSans.className}
  `}
      >
        {children}
        <SonnerProvider />
      </body>
    </html>
  );
}
