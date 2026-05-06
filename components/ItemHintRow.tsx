'use client';

interface ItemHint {
  item: string;
  location: string;
}

export function ItemHintRow({ item, location }: ItemHint) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
      <span className="font-mono text-[12px] text-[var(--hint-color)]">
        {item}
      </span>
    </div>
  );
}