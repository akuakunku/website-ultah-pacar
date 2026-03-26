import "./globals.css";
import "./birthday.css";

import { Inter, Caveat } from "next/font/google";
import type { Metadata, Viewport } from "next";

// 🔒 Centralized URL (ANTI ERROR)
const siteUrl = process.env.SITE_URL || "http://localhost:3000";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: true,
  fallback: ["cursive"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f06292",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Happy Birthday NABILA! 🎉❤️",
    template: "%s | Happy Birthday NABILA",
  },

  description:
    "Website ulang tahun spesial untuk NABILA tersayang dengan animasi 3D dan musik romantis",

  keywords: [
    "ulang tahun",
    "birthday",
    "nabila",
    "romantic",
    "3d animation",
  ],

  authors: [{ name: "Your Name", url: siteUrl }],
  creator: "Your Name",
  publisher: "Your Name",

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  openGraph: {
    title: "Happy Birthday NABILA! 🎉❤️",
    description: "Website ulang tahun spesial untuk NABILA tersayang",
    url: siteUrl,
    siteName: "Birthday NABILA",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Birthday NABILA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday NABILA! 🎉❤️",
    description: "Website ulang tahun spesial untuk NABILA tersayang",
    images: ["/og-image.jpg"],
    creator: "@yourusername",
  },

  robots: {
    index: true,
    follow: true,
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  appleWebApp: {
    capable: true,
    title: "Birthday NABILA",
    statusBarStyle: "default",
  },

  // ✅ FIX ERROR DI SINI
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },

  alternates: {
    canonical: siteUrl,
    languages: {
      "id-ID": siteUrl,
    },
  },

  category: "birthday",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${inter.className} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {children}

        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>
      </body>
    </html>
  );
}