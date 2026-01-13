import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProgressProvider from "@/components/ProgressProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://devmap.com"),
  title: {
    default: "DevMap - Your DSA Journey | Master Data Structures & Algorithms",
    template: "%s | DevMap",
  },
  description:
    "Navigate your DSA journey with DevMap - A comprehensive learning platform with progress tracking, achievements, and interactive tutorials. Master Data Structures and Algorithms with curated problems and structured learning paths.",
  keywords: [
    "DSA",
    "Data Structures",
    "Algorithms",
    "Programming",
    "Coding Interview",
    "LeetCode",
    "Practice Problems",
    "Learn to Code",
    "Software Engineering",
    "Computer Science",
    "Interview Preparation",
    "Competitive Programming",
    "DevMap",
  ],
  authors: [{ name: "DevMap Team" }],
  creator: "DevMap",
  publisher: "DevMap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devmap.com",
    title: "DevMap - Your DSA Journey",
    description:
      "Master Data Structures and Algorithms with comprehensive learning platform featuring progress tracking, achievements, and interactive tutorials.",
    siteName: "DevMap",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DevMap - Your DSA Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMap - Your DSA Journey",
    description:
      "Master Data Structures and Algorithms with comprehensive learning platform featuring progress tracking and achievements.",
    images: ["/og-image.svg"],
    creator: "@devmap",
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
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevMap",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('dsa-progress');
                  var darkMode = false;
                  var theme = 'fusion';
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    darkMode = parsed.darkMode;
                    theme = parsed.theme || 'fusion';
                  } else {
                    var localTheme = localStorage.getItem('theme');
                    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    darkMode = localTheme === 'dark' || (!localTheme && supportDarkMode);
                  }
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                  // Apply theme class to body
                  document.body.classList.add('theme-' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ProgressProvider>{children}</ProgressProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
