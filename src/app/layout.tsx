import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        {/* Fonts: Inter (body), JetBrains Mono (terminal), Orbitron (display) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-grid antialiased">
        {children}
      </body>
    </html>
  );
}
