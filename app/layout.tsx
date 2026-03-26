import "./globals.css";
import "./birthday.css";

import { Inter, Caveat } from "next/font/google";
import type { Metadata, Viewport } from "next";

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

// Viewport configuration - dipisah dari metadata
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f06292",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Happy Birthday NABILA! 🎉❤️",
    template: "%s | Happy Birthday NABILA"
  },
  description: "Website ulang tahun spesial untuk NABILA tersayang dengan animasi 3D dan musik romantis",
  keywords: ["ulang tahun", "birthday", "nabila", "pacar", "romantic", "3d animation", "kejutan"],
  authors: [{ name: "Your Name", url: process.env.SITE_URL }],
  creator: "Your Name",
  publisher: "Your Name",
  
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#f06292",
      },
    ],
  },

  openGraph: {
    title: "Happy Birthday NABILA! 🎉❤️",
    description: "Website ulang tahun spesial untuk NABILA tersayang",
    url: process.env.SITE_URL,
    siteName: "Birthday NABILA",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Birthday NABILA",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday NABILA! 🎉❤️",
    description: "Website ulang tahun spesial untuk NABILA tersayang",
    images: ["/og-image.jpg"],
    creator: "@yourusername",
    site: "@yourusername",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    startupImage: [
      {
        url: "/apple-splash-2048-2732.jpg",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  appLinks: {
    web: {
      url: process.env.SITE_URL,
      should_fallback: true,
    },
  },

  alternates: {
    canonical: process.env.SITE_URL,
    languages: {
      'id-ID': process.env.SITE_URL,
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
    <html 
      lang="id" 
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect ke domain penting */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Meta tags untuk security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Meta tags untuk crawlers */}
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        
        {/* Meta tags untuk mobile */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Birthday NABILA" />
        <meta name="application-name" content="Birthday NABILA" />
        <meta name="msapplication-TileColor" content="#f06292" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body 
        className={`${inter.className} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {children}
        
        {/* Skip to main content untuk accessibility */}
        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>
      </body>
    </html>
  );
}