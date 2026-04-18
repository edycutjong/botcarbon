# 🌍 BotCarbon — The Carbon Cost of Cyber Attacks

> **HackOWASP 8.0** | SDG 13 (Climate Action) × Cybersecurity | April 18-19, 2026

An edge analytics dashboard that quantifies the **wasted electricity and CO₂ emissions** caused by malicious bot traffic — turning cybersecurity into a verifiable ESG metric.

[![Live Demo](https://img.shields.io/badge/Demo-Live-22c55e?style=for-the-badge)](https://botcarbon.vercel.app)
[![Tech](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Edge](https://img.shields.io/badge/Cloudflare-Edge-F38020?style=for-the-badge&logo=cloudflare)](https://cloudflare.com)

---

## 💡 The Problem

Nobody tracks the carbon footprint of cyber attacks.

- A single DDoS attack can consume **150+ kWh** of wasted server compute
- Global bot traffic accounts for **30-40% of all internet requests**
- This invisible energy waste generates **millions of tons of CO₂ annually**

## 🛡️ The Solution

**BotCarbon** is a real-time SOC dashboard that:

1. **Quantifies** the energy wasted by malicious bot traffic (kWh per request)
2. **Visualizes** the carbon impact with live charts and equivalency metrics
3. **Demonstrates** the environmental benefit of edge protection (Cloudflare)
4. **Proves** that cybersecurity IS sustainability

> *The "fix" for a bad BotCarbon score is literally: "Route through Cloudflare."*

## 🖥️ Dashboard Features

| Feature | Description |
|---|---|
| **Traffic Monitor** | Real-time area chart showing blocked vs. passed attack traffic |
| **Carbon Gauge** | Live CO₂ savings counter with equivalency comparisons |
| **Shield Toggle** | Enable/disable Cloudflare Edge Shield in real-time |
| **Attack Map** | Geographic threat origins with intensity-scaled pulses |
| **Threat Log** | Terminal-style live stream of attack events |
| **Formula Tooltip** | Transparent methodology: `1 req = 0.12g CO₂` |

## 📐 The Math

```
Energy per request:     0.0003 kWh (SWD Model)
Grid emission factor:   0.400 kg CO₂/kWh (US average)
CO₂ per blocked req:    0.12g

→ 1,000,000 blocked requests = 120 kg CO₂ prevented
→ Equivalent to driving 292 miles 🚗
```

*Source: Sustainable Web Design Model (SWD), DIMPACT Project*

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│          Next.js 16 Dashboard            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Metric│ │Chart │ │Carbon│ │Attack│   │
│  │Cards │ │      │ │Gauge │ │ Log  │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│           ┌────────────┐                 │
│           │Shield Toggle│                │
│           └──────┬─────┘                 │
└──────────────────┼───────────────────────┘
                   │
        ┌──────────┴──────────┐
        │  Cloudflare Edge    │  ← Sponsor Integration
        │  (Edge Filtering)   │
        └──────────┬──────────┘
                   │
         ┌─────────┴─────────┐
         │  Python Simulator  │  ← DDoS / Brute Force
         │  (attack.py)       │
         └────────────────────┘
```

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Edge** | Cloudflare Workers |
| **Fonts** | Inter, JetBrains Mono, Orbitron |
| **Deploy** | Vercel |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/edycutjong/botcarbon.git
cd botcarbon

# Install
npm install

# Run
npm run dev
# → http://localhost:3000
```

### Run the Attack Simulator

```bash
# In a separate terminal
python scripts/attack.py --intensity high
```

## 📊 Demo Script (30 seconds)

1. **0:00** — Open the dark-mode SOC dashboard. Traffic is calm.
2. **0:05** — Run `python attack.py` in a terminal. Dashboard lights up red.
3. **0:10** — Charts spike: *"Warning: Attack consuming 150 kWh of wasted compute."*
4. **0:15** — Click **"Enable Cloudflare Edge Shield"** toggle.
5. **0:20** — Attack traffic drops to zero. Green counter animates: *"150 kWh saved. 60kg CO₂ prevented."*
6. **0:25** — Show equivalencies: *"That's like preventing 146 miles of driving."*
7. **0:30** — Formula tooltip: *"1 req = 0.12g CO₂ (SWD Model)"*

## 🏷️ Track Alignment

- **Primary**: SDG 13 — Climate Action
- **Secondary**: Cybersecurity (OWASP-aligned)
- **Sponsor**: Cloudflare (Technical Partner)

## 📄 License

MIT — Built for HackOWASP 8.0

---

**BotCarbon** — *Cybersecurity IS Sustainability* 🌍🛡️
