'use client';

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-green)] flex items-center justify-center text-lg font-bold shadow-lg shadow-[var(--color-cyan)]/20">
            <span className="text-white">BC</span>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--color-green)] blink" />
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BOT<span className="text-[var(--color-cyan)]">CARBON</span>
            </h1>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono tracking-widest uppercase">
              Cyber Attack Carbon Analytics
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-green)]" />
            <span className="text-[var(--color-text-secondary)]">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-cyan-dim)] border border-[var(--color-cyan)]/20 text-xs font-mono text-[var(--color-cyan)]">
            ☁️ Cloudflare Edge
          </div>
        </div>
      </div>
    </header>
  );
}
