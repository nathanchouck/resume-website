import "./globals.css";
import { SANS } from "@/utils/constants";
import { AppProvider } from "./provider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

export const metadata = {
  metadataBase: new URL("https://nathanhouck.com"),
  title: {
    default: "Nathan Houck",
    template: "%s — Nathan Houck",
  },
  description: "Aerospace engineering student at Embry-Riddle working on rocket propulsion, AI systems, and essays written by hand.",
  manifest: "/favicon-assets/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-assets/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-assets/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-assets/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/favicon-assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    siteName: "Nathan Houck",
    type: "website",
    url: "https://nathanhouck.com",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://nathanhouck.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${SANS.className} w-full overflow-x-hidden h-screen text-[var(--primary-text)] bg-[var(--bg)] transition-colors`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--accent) focus:text-(--button-text) focus:rounded focus:text-sm"
            >
              Skip to main content
            </a>
            <Navbar/>

            {children}

          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
