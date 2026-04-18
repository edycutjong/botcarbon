'use client';

import { MetricCard } from '@/components/MetricCard';
import { TrafficChart } from '@/components/TrafficChart';
import { ShieldToggle } from '@/components/ShieldToggle';
import { CarbonGauge } from '@/components/CarbonGauge';
import { AttackLog } from '@/components/AttackLog';
import { AttackMap } from '@/components/AttackMap';
import { FormulaTooltip } from '@/components/FormulaTooltip';
import { Header } from '@/components/Header';
import { ParticleField } from '@/components/ParticleField';
import { ThreatLevel } from '@/components/ThreatLevel';
import { calculateCarbon, formatNumber, formatKwh, formatCo2 } from '@/lib/carbon';
import {
  generateInitialTraffic,
  generateTrafficPoint,
  generateAttackBatch,
  type AttackEvent,
  type TrafficDataPoint,
} from '@/lib/mock-data';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Stagger container for cascading entrance */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

/** Individual item entrance animation */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function DashboardPage() {
  // ---- State (lazy initializers) ----
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const [shieldActive, setShieldActive] = useState(false);
  const [isUnderAttack, setIsUnderAttack] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>(() =>
    generateInitialTraffic(false)
  );
  const [attackLog, setAttackLog] = useState<AttackEvent[]>(() =>
    generateAttackBatch(15, false)
  );

  // Shield activation ripple state
  const [shieldRipple, setShieldRipple] = useState<{ id: number; active: boolean } | null>(null);

  // Ref to track shield state in intervals
  const shieldRef = useRef(shieldActive);
  const attackRef = useRef(isUnderAttack);

  useEffect(() => {
    shieldRef.current = shieldActive;
  }, [shieldActive]);

  useEffect(() => {
    attackRef.current = isUnderAttack;
  }, [isUnderAttack]);

  // ---- Cumulative totals from traffic data ----
  const totals = useMemo(() => {
    return trafficData.reduce(
      (acc, point) => ({
        blocked: acc.blocked + point.blocked,
        total: acc.total + point.total,
      }),
      { blocked: 0, total: 0 }
    );
  }, [trafficData]);
  
  const totalBlocked = totals.blocked;
  const totalRequests = totals.total;

  // ---- Blocked percentage for threat level ----
  const blockedPercentage = useMemo(() => {
    if (totalRequests === 0) return 0;
    return (totalBlocked / totalRequests) * 100;
  }, [totalBlocked, totalRequests]);

  // ---- Real-time traffic simulation ----
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = generateTrafficPoint(shieldRef.current, attackRef.current);
      setTrafficData((prev) => [...prev.slice(-29), newPoint]);

      // Generate attack log entries
      const newEvents = generateAttackBatch(
        attackRef.current ? Math.floor(Math.random() * 5) + 2 : 1,
        shieldRef.current
      );
      setAttackLog((prev) => [...newEvents, ...prev].slice(0, 50));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ---- Toggle handler with ripple effect ----
  const handleShieldToggle = useCallback(() => {
    setShieldActive((prev) => {
      const next = !prev;
      setShieldRipple({ id: Date.now(), active: next });
      return next;
    });
  }, []);

  // ---- Attack simulation toggle ----
  const handleAttackToggle = useCallback(() => {
    setIsUnderAttack((prev) => !prev);
  }, []);

  // ---- Carbon calculations ----
  const carbon = calculateCarbon(totalRequests, totalBlocked);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated particle network background */}
      <ParticleField shieldActive={shieldActive} isUnderAttack={isUnderAttack} />

      {/* Shield activation ripple */}
      <AnimatePresence>
        {shieldRipple && (
          <motion.div
            key={shieldRipple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setShieldRipple(null)}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
          >
            <div
              className={`w-40 h-40 rounded-full border-2 ${
                shieldRipple.active
                  ? 'border-green/40 bg-green/5'
                  : 'border-red/40 bg-red/5'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Threat level indicator */}
          <motion.div variants={fadeUp}>
            <ThreatLevel
              isUnderAttack={isUnderAttack}
              shieldActive={shieldActive}
              blockedPercentage={blockedPercentage}
            />
          </motion.div>

          {/* Top controls bar */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <ShieldToggle active={shieldActive} onToggle={handleShieldToggle} />
              <button
                id="attack-toggle"
                onClick={handleAttackToggle}
                className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-300 ${
                  isUnderAttack
                    ? 'bg-red-dim text-red border border-red/30'
                    : 'bg-bg-card text-text-secondary border border-border'
                }`}
              >
                {isUnderAttack ? '🔴 ATTACK ACTIVE' : '⚪ Idle'}
              </button>
            </div>
            <FormulaTooltip />
          </motion.div>

          {/* Metric cards row — staggered */}
          <motion.div variants={fadeUp} className="dashboard-grid mb-6">
            <MetricCard
              id="metric-blocked"
              label="Requests Blocked"
              value={formatNumber(carbon.blockedRequests)}
              icon="🛡️"
              color="cyan"
              subtitle={`of ${formatNumber(carbon.totalRequests)} total`}
            />
            <MetricCard
              id="metric-kwh"
              label="Energy Saved"
              value={formatKwh(carbon.savedKwh)}
              icon="⚡"
              color="green"
              subtitle={`${formatKwh(carbon.wastedKwh)} wasted`}
            />
            <MetricCard
              id="metric-co2"
              label="CO₂ Prevented"
              value={formatCo2(carbon.savedCo2Kg)}
              icon="🌍"
              color="green"
              subtitle={shieldActive ? 'Shield active' : 'Shield off'}
              highlight={shieldActive}
            />
            <MetricCard
              id="metric-response"
              label="Avg Block Time"
              value="<5ms"
              icon="⏱️"
              color="cyan"
              subtitle="Edge-computed"
            />
          </motion.div>

          {/* Main content grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Traffic chart (2/3 width) */}
            <div className="xl:col-span-2">
              <TrafficChart data={trafficData} shieldActive={shieldActive} />
            </div>

            {/* Carbon gauge (1/3 width) */}
            <div>
              <CarbonGauge carbon={carbon} shieldActive={shieldActive} />
            </div>
          </motion.div>

          {/* Bottom row: Attack map + Attack log */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div id="attack-map-section"><AttackMap events={attackLog} /></div>
            <div id="attack-log-section"><AttackLog events={attackLog} shieldActive={shieldActive} /></div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-text-muted font-mono">
          <span>BotCarbon — HackOWASP 8.0 | SDG 13 × Cybersecurity</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan blink" />
            Powered by Next.js Edge Analytics
          </span>
        </div>
      </footer>
    </div>
  );
}
