'use client';

interface BossCardProps {
  boss: string;
  originalBoss: string;
  isMajor: boolean;
}

export function BossCard({ boss, originalBoss, isMajor }: BossCardProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
      {isMajor && <div className="w-0.5 h-4 bg-[var(--gold-500)]" />}
      <span className="font-mono text-[12px]" style={{ color: isMajor ? 'var(--gold-500)' : 'var(--text-secondary)' }}>
        {boss}
      </span>
      <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
        ({originalBoss})
      </span>
    </div>
  );
}