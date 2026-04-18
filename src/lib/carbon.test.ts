import { calculateCarbon, formatNumber, formatKwh, formatCo2, getFormulaExplanation } from './carbon';
import { KWH_PER_REQUEST, CO2_PER_KWH, CO2_PER_REQUEST, EQUIVALENCIES } from './constants';

describe('Carbon Calculation Engine', () => {
  describe('calculateCarbon', () => {
    it('should calculate carbon metrics correctly', () => {
      const totalRequests = 1000;
      const blockedRequests = 400;
      const metrics = calculateCarbon(totalRequests, blockedRequests);

      expect(metrics.totalRequests).toBe(1000);
      expect(metrics.blockedRequests).toBe(400);
      expect(metrics.passedRequests).toBe(600);
      
      const expectedWastedKwh = 600 * KWH_PER_REQUEST;
      const expectedSavedKwh = 400 * KWH_PER_REQUEST;
      
      expect(metrics.wastedKwh).toBeCloseTo(expectedWastedKwh);
      expect(metrics.savedKwh).toBeCloseTo(expectedSavedKwh);
      
      const expectedWastedCo2Kg = expectedWastedKwh * CO2_PER_KWH;
      const expectedSavedCo2Kg = expectedSavedKwh * CO2_PER_KWH;
      
      expect(metrics.wastedCo2Kg).toBeCloseTo(expectedWastedCo2Kg);
      expect(metrics.savedCo2Kg).toBeCloseTo(expectedSavedCo2Kg);

      expect(metrics.equivalencies.carMiles).toBeCloseTo(expectedSavedCo2Kg / EQUIVALENCIES.CAR_KG_PER_MILE);
      expect(metrics.equivalencies.phoneCharges).toBeCloseTo(expectedSavedCo2Kg / EQUIVALENCIES.PHONE_CHARGE_KG);
      expect(metrics.equivalencies.treesYear).toBeCloseTo(expectedSavedCo2Kg / EQUIVALENCIES.TREE_KG_PER_YEAR);
      expect(metrics.equivalencies.homeDays).toBeCloseTo(expectedSavedKwh / EQUIVALENCIES.HOME_KWH_PER_DAY);
    });
  });

  describe('formatNumber', () => {
    it('should format millions', () => {
      expect(formatNumber(1_500_000)).toBe('1.5M');
      expect(formatNumber(1_000_000)).toBe('1.0M');
    });

    it('should format thousands', () => {
      expect(formatNumber(1_500)).toBe('1.5K');
      expect(formatNumber(1_000)).toBe('1.0K');
      expect(formatNumber(999_999)).toBe('1000.0K'); // 999999 / 1000 = 999.999 => 1000.0K
    });

    it('should format numbers under 1000', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(42)).toBe('42');
    });
  });

  describe('formatKwh', () => {
    it('should format MWh for >= 1000 kWh', () => {
      expect(formatKwh(1500)).toBe('1.5 MWh');
      expect(formatKwh(1000)).toBe('1.0 MWh');
    });

    it('should format kWh for >= 1 kWh and < 1000 kWh', () => {
      expect(formatKwh(1.5)).toBe('1.5 kWh');
      expect(formatKwh(1)).toBe('1.0 kWh');
      expect(formatKwh(999.9)).toBe('999.9 kWh');
    });

    it('should format Wh for < 1 kWh', () => {
      expect(formatKwh(0.5)).toBe('500.0 Wh');
      expect(formatKwh(0.001)).toBe('1.0 Wh');
      expect(formatKwh(0)).toBe('0.0 Wh');
    });
  });

  describe('formatCo2', () => {
    it('should format t for >= 1000 kg', () => {
      expect(formatCo2(1500)).toBe('1.50 t');
      expect(formatCo2(1000)).toBe('1.00 t');
    });

    it('should format kg for >= 1 kg and < 1000 kg', () => {
      expect(formatCo2(1.5)).toBe('1.5 kg');
      expect(formatCo2(1)).toBe('1.0 kg');
      expect(formatCo2(999.9)).toBe('999.9 kg');
    });

    it('should format g for < 1 kg', () => {
      expect(formatCo2(0.5)).toBe('500 g');
      expect(formatCo2(0.001)).toBe('1 g');
      expect(formatCo2(0)).toBe('0 g');
    });
  });

  describe('getFormulaExplanation', () => {
    it('should return the correctly formatted explanation string', () => {
      const expectedText = `Each HTTP request consumes approximately ${KWH_PER_REQUEST} kWh of server energy. At the US grid average of ${CO2_PER_KWH} kg CO₂/kWh, each blocked malicious request prevents ${(CO2_PER_REQUEST * 1000).toFixed(2)}g of CO₂ emissions. Source: Sustainable Web Design Model (SWD).`;
      expect(getFormulaExplanation()).toBe(expectedText);
    });
  });
});
