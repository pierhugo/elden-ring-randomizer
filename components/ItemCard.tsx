'use client';

interface ItemCardProps {
  location: string;
  items: string[];
}

export function ItemCard({ location, items }: ItemCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--gold-500)]">{location}</span>
      </div>
      <div className="p-3 space-y-1.5">
        {items.map((item: string, idx: number) => (
          <div key={idx} className="font-mono text-[11px] text-[var(--text-secondary)]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}