import {
  generateAttackEvent,
  generateAttackBatch,
  generateInitialTraffic,
  generateTrafficPoint,
  DEMO_SCENARIOS,
} from './mock-data';

describe('Mock Data Generator', () => {
  let mathRandomSpy: jest.SpyInstance;

  beforeEach(() => {
    mathRandomSpy = jest.spyOn(global.Math, 'random');
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  describe('generateAttackEvent', () => {
    it('generates an attack event with shield active and blocked (random > 0.05)', () => {
      mathRandomSpy.mockReturnValue(0.1); 
      const event = generateAttackEvent(true);
      expect(event.blocked).toBe(true);
      expect(event.statusCode).toBe(403);
      expect(event.responseTimeMs).toBeLessThanOrEqual(5);
    });

    it('generates an attack event with shield active and passed (random <= 0.05)', () => {
      mathRandomSpy.mockReturnValue(0.04);
      const event = generateAttackEvent(true);
      expect(event.blocked).toBe(false);
      expect([200, 500, 503]).toContain(event.statusCode);
      expect(event.responseTimeMs).toBeGreaterThanOrEqual(50);
    });

    it('generates an attack event with shield inactive and blocked (random > 0.7)', () => {
      mathRandomSpy.mockReturnValue(0.8);
      const event = generateAttackEvent(false);
      expect(event.blocked).toBe(true);
      expect(event.statusCode).toBe(403);
      expect(event.responseTimeMs).toBeLessThanOrEqual(5);
    });

    it('generates an attack event with shield inactive and passed (random <= 0.7)', () => {
      mathRandomSpy.mockReturnValue(0.6);
      const event = generateAttackEvent(false);
      expect(event.blocked).toBe(false);
      expect([200, 500, 503]).toContain(event.statusCode);
      expect(event.responseTimeMs).toBeGreaterThanOrEqual(50);
    });

    it('has valid IP address shape', () => {
      mathRandomSpy.mockRestore(); // use actual random for this
      const event = generateAttackEvent(true);
      const ipParts = event.ip.split('.');
      expect(ipParts.length).toBe(4);
      ipParts.forEach(part => {
        const num = parseInt(part, 10);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(255);
      });
    });
  });

  describe('generateAttackBatch', () => {
    it('generates N events', () => {
      const batch = generateAttackBatch(5, true);
      expect(batch.length).toBe(5);
    });
  });

  describe('generateInitialTraffic', () => {
    it('generates 30 traffic points with shield active', () => {
      const points = generateInitialTraffic(true);
      expect(points.length).toBe(30);
      expect(points[0].total).toBe(points[0].blocked + points[0].passed);
      expect(points[0].kwhWasted).toBe(points[0].passed * 0.0003);
    });

    it('generates 30 traffic points with shield inactive', () => {
      const points = generateInitialTraffic(false);
      expect(points.length).toBe(30);
      expect(points[0].total).toBe(points[0].blocked + points[0].passed);
    });
  });

  describe('generateTrafficPoint', () => {
    it('generates traffic point under attack with shield active', () => {
      const point = generateTrafficPoint(true, true);
      expect(point.total).toBeGreaterThan(0);
      expect(point.blocked).toBeGreaterThanOrEqual(0);
      expect(point.passed).toBeGreaterThanOrEqual(0);
      expect(point.total).toBe(point.blocked + point.passed);
    });

    it('generates traffic point under attack with shield inactive', () => {
      const point = generateTrafficPoint(false, true);
      expect(point.total).toBeGreaterThan(0);
      expect(point.total).toBe(point.blocked + point.passed);
    });

    it('generates traffic point not under attack with shield active', () => {
      const point = generateTrafficPoint(true, false);
      expect(point.total).toBeGreaterThan(0);
      expect(point.total).toBe(point.blocked + point.passed);
    });

    it('generates traffic point not under attack with shield inactive', () => {
      const point = generateTrafficPoint(false, false);
      expect(point.total).toBeGreaterThan(0);
      expect(point.total).toBe(point.blocked + point.passed);
    });
  });

  describe('DEMO_SCENARIOS', () => {
    it('contains exact configurations', () => {
      expect(DEMO_SCENARIOS.quiet).toBeDefined();
      expect(DEMO_SCENARIOS.ddos).toBeDefined();
      expect(DEMO_SCENARIOS.bruteForce).toBeDefined();
    });
  });
});
