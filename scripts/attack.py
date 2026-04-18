#!/usr/bin/env python3
"""
BotCarbon — DDoS Attack Simulator
==================================
Simulates malicious bot traffic against a target server for demo purposes.
Shows the carbon impact of unmitigated cyber attacks.

Usage:
    python attack.py                    # Default: localhost:3000
    python attack.py --target URL       # Custom target
    python attack.py --intensity high   # Low / Medium / High intensity
"""

import argparse
import asyncio
import random
import time
import sys
from datetime import datetime

# ANSI colors for terminal output
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
DIM = "\033[2m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Attack config
ATTACK_TYPES = [
    ("DDoS Flood", "GET", "/"),
    ("SQL Injection", "POST", "/api/login"),
    ("XSS Probe", "GET", "/search?q=<script>alert(1)</script>"),
    ("Brute Force", "POST", "/api/login"),
    ("Bot Scraping", "GET", "/api/users"),
    ("Credential Stuffing", "POST", "/api/auth"),
    ("API Abuse", "GET", "/api/v1/tokens"),
    ("Path Traversal", "GET", "/../../../etc/passwd"),
]

INTENSITY = {
    "low": {"rps": 50, "concurrent": 5, "label": "Reconnaissance"},
    "medium": {"rps": 200, "concurrent": 20, "label": "Sustained Attack"},
    "high": {"rps": 800, "concurrent": 50, "label": "Full DDoS Flood"},
}

# Carbon constants (same as frontend)
KWH_PER_REQUEST = 0.0003
CO2_PER_KWH = 0.4  # kg


def fake_ip():
    return f"{random.randint(1, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"


def print_banner():
    print(f"""
{RED}{BOLD}╔══════════════════════════════════════════════════════╗
║          🔴 BotCarbon Attack Simulator 🔴             ║
║        For demonstration purposes only.               ║
╚══════════════════════════════════════════════════════╝{RESET}
""")


def print_stats(total, elapsed, intensity_label):
    kwh_wasted = total * KWH_PER_REQUEST
    co2_kg = kwh_wasted * CO2_PER_KWH
    rps = total / max(elapsed, 0.001)

    sys.stdout.write(f"\r{BOLD}[{YELLOW}{intensity_label}{RESET}{BOLD}]{RESET} "
                     f"Requests: {RED}{total:,}{RESET} | "
                     f"RPS: {RED}{rps:.0f}{RESET} | "
                     f"kWh wasted: {RED}{kwh_wasted:.2f}{RESET} | "
                     f"CO₂: {RED}{co2_kg * 1000:.1f}g{RESET} | "
                     f"Elapsed: {DIM}{elapsed:.1f}s{RESET}   ")
    sys.stdout.flush()


async def simulate_attack(target, intensity_key):
    config = INTENSITY[intensity_key]
    print_banner()
    print(f"{CYAN}Target:{RESET}     {target}")
    print(f"{CYAN}Intensity:{RESET}  {config['label']} ({config['rps']} req/s)")
    print(f"{CYAN}Started:{RESET}    {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{DIM}{'─' * 56}{RESET}")
    print()

    total_requests = 0
    start_time = time.time()

    try:
        while True:
            batch_size = random.randint(
                config["rps"] // 4,
                config["rps"]
            )

            for _ in range(batch_size):
                attack = random.choice(ATTACK_TYPES)
                ip = fake_ip()
                total_requests += 1

                # Print individual attacks occasionally
                if random.random() < 0.02:
                    print(f"\n  {RED}▸{RESET} {DIM}{ip:>15}{RESET} "
                          f"{YELLOW}{attack[1]:>4}{RESET} "
                          f"{attack[2][:40]:<40} "
                          f"{RED}{attack[0]}{RESET}")

            elapsed = time.time() - start_time
            print_stats(total_requests, elapsed, config["label"])

            await asyncio.sleep(1)

    except KeyboardInterrupt:
        elapsed = time.time() - start_time
        kwh_total = total_requests * KWH_PER_REQUEST
        co2_total = kwh_total * CO2_PER_KWH

        print(f"\n\n{DIM}{'─' * 56}{RESET}")
        print(f"\n{BOLD}📊 Attack Summary{RESET}")
        print(f"   Total requests:  {RED}{total_requests:,}{RESET}")
        print(f"   Duration:        {elapsed:.1f}s")
        print(f"   Avg RPS:         {total_requests / max(elapsed, 1):.0f}")
        print(f"   Energy wasted:   {RED}{kwh_total:.2f} kWh{RESET}")
        print(f"   CO₂ emitted:     {RED}{co2_total * 1000:.1f}g ({co2_total:.4f} kg){RESET}")
        print()
        print(f"   {GREEN}💡 If routed through Cloudflare Edge Shield:{RESET}")
        print(f"      {GREEN}~{kwh_total * 0.95:.2f} kWh saved{RESET}")
        print(f"      {GREEN}~{co2_total * 0.95 * 1000:.1f}g CO₂ prevented{RESET}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description="BotCarbon DDoS Attack Simulator (Demo Only)"
    )
    parser.add_argument(
        "--target",
        default="http://localhost:3000",
        help="Target URL (default: http://localhost:3000)"
    )
    parser.add_argument(
        "--intensity",
        choices=["low", "medium", "high"],
        default="high",
        help="Attack intensity (default: high)"
    )
    args = parser.parse_args()

    asyncio.run(simulate_attack(args.target, args.intensity))


if __name__ == "__main__":
    main()
