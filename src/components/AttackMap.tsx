'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AttackEvent } from '@/lib/mock-data';
import { ATTACK_ORIGINS } from '@/lib/constants';
import { useMemo } from 'react';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface AttackMapProps {
  events: AttackEvent[];
}

export function AttackMap({ events }: AttackMapProps) {
  // Aggregate attack counts by origin
  const originCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      counts[event.originId] = (counts[event.originId] || 0) + 1;
    }
    return counts;
  }, [events]);

  return (
    <div className="glass-card gradient-border p-5 h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2
            className="text-sm font-bold tracking-wider text-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ATTACK ORIGINS
          </h2>
          <p className="text-[10px] text-text-muted font-mono mt-0.5">
            Geographic threat intelligence
          </p>
        </div>
        <span className="text-xs font-mono text-text-muted">
          {Object.keys(originCounts).length} sources
        </span>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-bg-primary rounded-lg border border-border overflow-hidden">
        
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: '10% 10%',
          }}
        />

        <div className="absolute inset-0">
          <ComposableMap
            projectionConfig={{ scale: 140, center: [0, 20] }}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(148, 163, 184, 0.05)"
                    stroke="rgba(6, 182, 212, 0.2)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(6, 182, 212, 0.15)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Attack origin dots */}
            {ATTACK_ORIGINS.map((origin) => {
              const count = originCounts[origin.id] || 0;
              const intensity = Math.min(count / 10, 1);
              
              // Only render if we have coordinates
              if (!origin.coordinates) return null;

              return (
                <Marker key={origin.id} coordinates={origin.coordinates as [number, number]}>
                  {/* Outer group using standard CSS animation for fade-in */}
                  <g className="group animate-in fade-in duration-1000 fill-mode-both" style={{ animationDelay: `${Math.random() * 0.5}s` }}>
                    {/* Pulse ring outer invisible wrapper for hover */}
                    <circle cx={0} cy={0} r={16} fill="transparent" className="cursor-crosshair" />

                    {/* Pulse ring */}
                    {count > 0 && (
                      <circle
                        cx={0}
                        cy={0}
                        r={8 + intensity * 12}
                        fill={`rgba(239, 68, 68, ${0.1 + intensity * 0.2})`}
                        className="animate-ping"
                        style={{ transformOrigin: 'center' }}
                      />
                    )}

                    {/* Core dot */}
                    <circle
                      cx={0}
                      cy={0}
                      r={4 + intensity * 6}
                      fill={count > 0 ? `rgba(239, 68, 68, ${0.4 + intensity * 0.6})` : 'rgba(148, 163, 184, 0.5)'}
                      stroke={count > 0 ? `rgba(239, 68, 68, ${0.6 + intensity * 0.4})` : 'rgba(148, 163, 184, 0.3)'}
                      strokeWidth={2}
                      style={{
                        filter: count > 0 ? `drop-shadow(0 0 ${5 + intensity * 10}px rgba(239, 68, 68, ${0.5}))` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />

                    {/* Tooltip (SVG foreignObject allows HTML inside SVG markers) */}
                    <foreignObject x="-100" y="-40" width="200" height="40" className="opacity-0 group-hover:opacity-100 pointer-events-none" style={{ transition: 'opacity 0.2s ease-in-out' }}>
                      <div className="flex justify-center w-full">
                        <div className="bg-bg-secondary border border-border rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap inline-flex items-center shadow-lg backdrop-blur-md">
                          <span className="text-text-primary font-bold">{origin.label}</span>
                          <span className="text-red ml-1.5">{count} attacks</span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Label bottom-right */}
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-text-muted/50 pointer-events-none">
          GLOBAL THREAT INTEL
        </div>
      </div>
    </div>
  );
}

