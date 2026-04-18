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
  { id: 'us', label: 'United States', coordinates: [-95.7129, 37.0902], weight: 0.15 },
  { id: 'cn', label: 'China', coordinates: [104.1954, 35.8617], weight: 0.25 },
  { id: 'ru', label: 'Russia', coordinates: [105.3188, 61.5240], weight: 0.20 },
  { id: 'br', label: 'Brazil', coordinates: [-51.9253, -14.2350], weight: 0.08 },
  { id: 'in', label: 'India', coordinates: [78.9629, 20.5937], weight: 0.10 },
  { id: 'de', label: 'Germany', coordinates: [10.4515, 51.1657], weight: 0.05 },
  { id: 'ng', label: 'Nigeria', coordinates: [8.6753, 9.0820], weight: 0.07 },
  { id: 'kr', label: 'South Korea', coordinates: [127.7669, 35.9078], weight: 0.05 },
  { id: 'ua', label: 'Ukraine', coordinates: [31.1656, 48.3794], weight: 0.05 },
] as const;
