'use client';

import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shadow-lg shadow-(--color-cyan)/20 rounded-xl">
            <Image src="/icon.png" alt="BotCarbon Logo" fill sizes="40px" className="object-cover rounded-xl" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green blink" />
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BOT<span className="text-cyan">CARBON</span>
            </h1>
            <p className="text-[10px] text-text-muted font-mono tracking-widest uppercase">
              Cyber Attack Carbon Analytics
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-green" />
            <span className="text-text-secondary">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-dim border border-cyan/20 text-xs font-mono text-cyan">
            ☁️ Cloudflare Edge
          </div>
        </div>
      </div>
    </header>
  );
}
