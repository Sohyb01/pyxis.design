import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "./seo";
import "./globals.css";
import "./css/components.css";
import "./css/backgrounds.css";

const nohemi = localFont({
  src: [
    {
      path: "../public/Nohemi-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Pyxis Studio", url: siteConfig.url }],
  creator: "Pyxis Studio",
  publisher: "Pyxis Studio",
  category: "Design and development studio",
  icons: {
    icon: "/favicon.ico",
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
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${nohemi.variable} h-screen overflow-y-hidden`} lang="en">
      <body className="h-full overflow-y-scroll font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
