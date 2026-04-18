import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BotCarbon — The Carbon Cost of Cyber Attacks",
  description:
    "Real-time analytics dashboard that quantifies the wasted electricity and CO₂ emissions caused by malicious bot traffic. Turn cybersecurity into a verifiable ESG metric.",
  keywords: [
    "cybersecurity",
    "carbon footprint",
    "bot traffic",
    "DDoS",
    "CO2 emissions",
    "cloudflare",
    "ESG",
    "sustainability",
    "SDG 13",
    "climate action",
  ],
  openGraph: {
    title: "BotCarbon — The Carbon Cost of Cyber Attacks",
    description:
      "Quantify the CO₂ emissions caused by malicious bot traffic. Edge analytics for sustainable cybersecurity.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotCarbon — Cybersecurity x SDG 13",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="min-h-screen bg-orbs antialiased">
        {children}
      </body>
    </html>
  );
}
