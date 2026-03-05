import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL("https://xboostai.in"),
  title: {
    default: "XBoost AI | Twitter Growth System",
    template: "%s | XBoost AI",
  },
  description:
    "XBoost AI helps creators and founders grow on X with AI-powered replies, tweet generation, modules, and analytics.",
  applicationName: "XBoost AI",
  keywords: [
    "X growth",
    "Twitter growth",
    "AI tweet generator",
    "AI replies",
    "creator tools",
    "personal brand",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://xboostai.in",
    siteName: "XBoost AI",
    title: "XBoost AI | Twitter Growth System",
    description:
      "Grow faster on X with AI replies, tweet generation, modules, and analytics.",
    images: [
      {
        url: "/favicon-128.png",
        width: 128,
        height: 128,
        alt: "XBoost AI",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "XBoost AI | Twitter Growth System",
    description:
      "Grow faster on X with AI replies, tweet generation, modules, and analytics.",
    images: ["/favicon-128.png"],
    creator: "@smshipps",
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("xboost_theme");
                var theme = t === "dark" ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", theme);
              } catch (_) {}
            `,
          }}
        />
      </head>
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

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D9XBXYQQD7"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D9XBXYQQD7');
          `}
        </Script>
      </body>
    </html>
  );
}
