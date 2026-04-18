// ========================================
// BotCarbon — Mock Data Generator
// ========================================

import { ATTACK_TYPES, ATTACK_ORIGINS, type AttackType } from './constants';

export interface AttackEvent {
  id: string;
  timestamp: number;
  type: AttackType;
  origin: string;
  originId: string;
  ip: string;
  path: string;
  blocked: boolean;
  statusCode: number;
  responseTimeMs: number;
}

export interface TrafficDataPoint {
  time: string;
  timestamp: number;
  total: number;
  blocked: number;
  passed: number;
  kwhWasted: number;
}

/** Generate a random IP address */
function randomIp(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

/** Pick a random item from an array */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Common attack paths */
const ATTACK_PATHS = [
  '/api/login',
  '/wp-admin',
  '/api/users',
  '/.env',
  '/api/graphql',
  '/admin/config',
  '/api/v1/tokens',
  '/xmlrpc.php',
  '/api/upload',
  '/phpmyadmin',
];

/** Generate a single attack event */
export function generateAttackEvent(shieldActive: boolean): AttackEvent {
  const origin = pick(ATTACK_ORIGINS);
  const type = pick(ATTACK_TYPES);
  const blocked = shieldActive ? Math.random() > 0.05 : Math.random() > 0.7;

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type,
    origin: origin.label,
    originId: origin.id,
    ip: randomIp(),
    path: pick(ATTACK_PATHS),
    blocked,
    statusCode: blocked ? 403 : pick([200, 200, 500, 503]),
    responseTimeMs: blocked ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 200) + 50,
  };
}

/** Generate N attack events */
export function generateAttackBatch(count: number, shieldActive: boolean): AttackEvent[] {
  return Array.from({ length: count }, () => generateAttackEvent(shieldActive));
}

/** Generate initial historical traffic data (last 30 data points) */
export function generateInitialTraffic(shieldActive: boolean): TrafficDataPoint[] {
  const now = Date.now();
  const points: TrafficDataPoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const timestamp = now - i * 2000;
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Base traffic
    const base = Math.floor(Math.random() * 50) + 20;
    // Attack traffic (spiky when shield is off)
    const attackMultiplier = shieldActive ? 0.3 : 1;
    const attackTraffic = Math.floor(Math.random() * 200 * attackMultiplier);
    const total = base + attackTraffic;
    const blocked = shieldActive
      ? Math.floor(attackTraffic * 0.95)
      : Math.floor(attackTraffic * 0.1);
    const passed = total - blocked;

    points.push({
      time,
      timestamp,
      total,
      blocked,
      passed,
      kwhWasted: passed * 0.0003,
    });
  }

  return points;
}

/** Generate a new traffic data point */
export function generateTrafficPoint(shieldActive: boolean, isUnderAttack: boolean): TrafficDataPoint {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const base = Math.floor(Math.random() * 50) + 20;
  const attackTraffic = isUnderAttack
    ? Math.floor(Math.random() * 500) + 200
    : Math.floor(Math.random() * 30);

  const total = base + attackTraffic;
  const blocked = shieldActive
    ? Math.floor(attackTraffic * 0.95) + Math.floor(base * 0.02)
    : Math.floor(attackTraffic * 0.08);
  const passed = total - blocked;

  return {
    time,
    timestamp: now.getTime(),
    total,
    blocked,
    passed,
    kwhWasted: passed * 0.0003,
  };
}

/** Pre-seeded demo scenario data for consistent demo */
export const DEMO_SCENARIOS = {
  /** Quiet state — minimal attack traffic */
  quiet: {
    requestsPerSec: 30,
    attackPercentage: 0.05,
    description: 'Normal operations',
  },
  /** Under attack — heavy DDoS */
  ddos: {
    requestsPerSec: 800,
    attackPercentage: 0.92,
    description: 'DDoS flood detected',
  },
  /** Brute force — targeted login attempts */
  bruteForce: {
    requestsPerSec: 150,
    attackPercentage: 0.80,
    description: 'Credential stuffing in progress',
  },
} as const;
