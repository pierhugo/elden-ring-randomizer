'use client';

import { BossCard } from './BossCard';

interface Placement {
  boss: string;
  originalBoss: string;
}

interface RegionSectionProps {
  region: string;
  locations: Record<string, Placement[]>;
  formatLocationName: (location: string) => string;
  isMajorBoss: (bossName: string) => boolean;
}

export function RegionSection({ region, locations, formatLocationName, isMajorBoss }: RegionSectionProps) {
  const locationCount = Object.keys(locations).length;
  const bossCount = Object.values(locations).reduce((sum, loc) => sum + loc.length, 0);

  return (
    <section>
      <header className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-subtle)]">
        <span className="w-1 h-6 bg-[var(--gold-500)]" />
        <h2 className="font-display text-[14px] uppercase tracking-[0.2em] text-[var(--gold-500)]">{region}</h2>
        <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
          {locationCount} loc · {bossCount} boss
        </span>
      </header>
      
      <div className="space-y-3">
        {Object.entries(locations).map(([location, placements]) => (
          <div key={location} className="grid grid-cols-[1fr_220px] gap-x-6">
            <div className="space-y-2">
              {placements.map((placement, idx) => (
                <BossCard
                  key={idx}
                  boss={placement.boss}
                  originalBoss={placement.originalBoss}
                  isMajor={isMajorBoss(placement.boss)}
                />
              ))}
            </div>
            <div className="font-mono text-[12px] text-[var(--text-secondary)] text-right self-center">
              {formatLocationName(location)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}