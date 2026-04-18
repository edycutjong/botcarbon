// ========================================
// BotCarbon — Constants & Configuration
// ========================================

/** CO2 per HTTP request blocked (kWh). Based on SWD model: avg server energy per request */
export const KWH_PER_REQUEST = 0.0003;

/** CO2 per kWh (kg). US grid average emission factor */
export const CO2_PER_KWH = 0.4;

/** CO2 per blocked request (kg) */
export const CO2_PER_REQUEST = KWH_PER_REQUEST * CO2_PER_KWH;

/** Equivalency factors */
export const EQUIVALENCIES = {
  /** kg CO2 per mile driven (avg US car) */
  CAR_KG_PER_MILE: 0.411,
  /** kg CO2 per phone charge */
  PHONE_CHARGE_KG: 0.005,
  /** kg CO2 absorbed per tree per year */
  TREE_KG_PER_YEAR: 22,
  /** kWh per average US home per day */
  HOME_KWH_PER_DAY: 30,
};

/** Attack types for the simulator */
export const ATTACK_TYPES = [
  'DDoS Flood',
  'Brute Force',
  'SQL Injection',
  'XSS Probe',
  'Bot Scraping',
  'Credential Stuffing',
  'API Abuse',
  'Path Traversal',
] as const;

export type AttackType = (typeof ATTACK_TYPES)[number];

/** Color scheme */
export const COLORS = {
  cyan: '#06b6d4',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#a855f7',
  slate: '#475569',
};

/** Severity levels */
export const SEVERITY = {
  LOW: { label: 'Low', color: COLORS.amber, threshold: 10 },
  MEDIUM: { label: 'Medium', color: COLORS.amber, threshold: 50 },
  HIGH: { label: 'High', color: COLORS.red, threshold: 100 },
  CRITICAL: { label: 'Critical', color: COLORS.red, threshold: Infinity },
};

/** Attack origins for the world map */
export const ATTACK_ORIGINS = [
  { id: 'us', label: 'United States', x: 22, y: 38, weight: 0.15 },
  { id: 'cn', label: 'China', x: 78, y: 35, weight: 0.25 },
  { id: 'ru', label: 'Russia', x: 65, y: 25, weight: 0.20 },
  { id: 'br', label: 'Brazil', x: 32, y: 65, weight: 0.08 },
  { id: 'in', label: 'India', x: 72, y: 42, weight: 0.10 },
  { id: 'de', label: 'Germany', x: 52, y: 30, weight: 0.05 },
  { id: 'ng', label: 'Nigeria', x: 50, y: 50, weight: 0.07 },
  { id: 'kr', label: 'South Korea', x: 82, y: 36, weight: 0.05 },
  { id: 'ua', label: 'Ukraine', x: 58, y: 30, weight: 0.05 },
] as const;
