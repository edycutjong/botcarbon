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
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="min-h-screen bg-grid antialiased">
        {children}
      </body>
    </html>
  );
}
