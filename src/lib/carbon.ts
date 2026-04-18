// ========================================
// BotCarbon — Carbon Calculation Engine
// ========================================

import {
  KWH_PER_REQUEST,
  CO2_PER_KWH,
  CO2_PER_REQUEST,
  EQUIVALENCIES,
} from './constants';

export interface CarbonMetrics {
  totalRequests: number;
  blockedRequests: number;
  passedRequests: number;
  wastedKwh: number;
  savedKwh: number;
  wastedCo2Kg: number;
  savedCo2Kg: number;
  equivalencies: {
    carMiles: number;
    phoneCharges: number;
    treesYear: number;
    homeDays: number;
  };
}

/** Calculate carbon metrics from request counts */
export function calculateCarbon(
  totalRequests: number,
  blockedRequests: number
): CarbonMetrics {
  const passedRequests = totalRequests - blockedRequests;

  const wastedKwh = passedRequests * KWH_PER_REQUEST;
  const savedKwh = blockedRequests * KWH_PER_REQUEST;

  const wastedCo2Kg = wastedKwh * CO2_PER_KWH;
  const savedCo2Kg = savedKwh * CO2_PER_KWH;

  return {
    totalRequests,
    blockedRequests,
    passedRequests,
    wastedKwh,
    savedKwh,
    wastedCo2Kg,
    savedCo2Kg,
    equivalencies: {
      carMiles: savedCo2Kg / EQUIVALENCIES.CAR_KG_PER_MILE,
      phoneCharges: savedCo2Kg / EQUIVALENCIES.PHONE_CHARGE_KG,
      treesYear: savedCo2Kg / EQUIVALENCIES.TREE_KG_PER_YEAR,
      homeDays: savedKwh / EQUIVALENCIES.HOME_KWH_PER_DAY,
    },
  };
}

/** Format large numbers with K/M suffixes */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

/** Format kWh with appropriate units */
export function formatKwh(kwh: number): string {
  if (kwh >= 1000) return `${(kwh / 1000).toFixed(1)} MWh`;
  if (kwh >= 1) return `${kwh.toFixed(1)} kWh`;
  return `${(kwh * 1000).toFixed(1)} Wh`;
}

/** Format CO2 with appropriate units */
export function formatCo2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  if (kg >= 1) return `${kg.toFixed(1)} kg`;
  return `${(kg * 1000).toFixed(0)} g`;
}

/** Get the formula explanation text */
export function getFormulaExplanation(): string {
  return `Each HTTP request consumes approximately ${KWH_PER_REQUEST} kWh of server energy. At the US grid average of ${CO2_PER_KWH} kg CO₂/kWh, each blocked malicious request prevents ${(CO2_PER_REQUEST * 1000).toFixed(2)}g of CO₂ emissions. Source: Sustainable Web Design Model (SWD).`;
}
