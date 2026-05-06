'use client';

import { useState, useEffect } from 'react';
import { parseUploadedLog } from '@/lib/parser';
import { RegionSection } from '@/components/RegionSection';
import { ItemHintRow } from '@/components/ItemHintRow';

interface Placement {
  boss: string;
  originalBoss: string;
}

export default function Home() {
  const [seedData, setSeedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'bosses' | 'hints'>('bosses');

  useEffect(() => {
    fetch('/default-log.txt')
      .then(res => res.text())
      .then(content => {
        const parsed = parseUploadedLog(content);
        setSeedData(parsed);
      })
      .catch(err => console.error('Failed to load default log:', err));
  }, []);

  const bossPlacementsByRegion = seedData?.bossPlacements?.reduce((acc: Record<string, Record<string, any[]>>, placement: any) => {
    const location = placement.location;
    const parts = location.split('-');
    const majorRegion = parts[0];
    if (!acc[majorRegion]) acc[majorRegion] = {};
    if (!acc[majorRegion][location]) acc[majorRegion][location] = [];
    acc[majorRegion][location].push(placement);
    return acc;
  }, {} as Record<string, Record<string, any[]>>) || {};

  const hintsList = seedData?.hints?.keyItems ?
    Object.entries(seedData.hints.keyItems).map(([item, location]) => ({
      item: item,
      location: (location as string).replace(': ', '')
    })) : [];

  const formatLocationName = (location: string) => {
    const parts = location.split('-');
    return parts.slice(1).map((p: string) => p.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' - ');
  };

  const formatRegionName = (region: string) => {
    return region.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const majorBosses = [
    'radahn', 'messmer', 'godfrey', 'maliketh', 'mohg', 'romina',
    'omen king', 'malenia', 'rellana', 'midra', 'bayle', 'radagon',
    'placidusax', 'godrick', 'margit', 'putrescent knight', 'divine beast dancing lion',
    'commander gaius', 'rykard', 'niall', 'fortissax', 'godskin duo',
    'scadutree avatar', 'golden hippopotamus', 'rennala', 'loretta',
    'metyr', 'astel', 'regal ancestor spirit', 'fire giant', 'elden beast'
  ];

  const isMajorBoss = (bossName: string): boolean => {
    const normalized = bossName.toLowerCase();
    return majorBosses.some(b => normalized.includes(b));
  };

  const totalBosses = seedData?.bossPlacements?.length || 0;
  const hintCount = hintsList.length;

  if (!seedData) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--text-tertiary)] font-mono text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('bosses')}
              className={`px-5 py-4 font-mono text-[12px] uppercase tracking-wider transition-colors ${
                activeTab === 'bosses'
                  ? 'text-[var(--gold-500)] border-b-2 border-[var(--gold-500)] -mb-[1px]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Bosses ({totalBosses})
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-5 py-4 font-mono text-[12px] uppercase tracking-wider transition-colors ${
                activeTab === 'hints'
                  ? 'text-[var(--gold-500)] border-b-2 border-[var(--gold-500)] -mb-[1px]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Hints ({hintCount})
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 py-8">
        {activeTab === 'bosses' && (
          <div className="space-y-8">
            {Object.entries(bossPlacementsByRegion).map(([region, locations]) => (
              <RegionSection
                key={region}
                region={formatRegionName(region)}
                locations={locations as Record<string, Placement[]>}
                formatLocationName={formatLocationName}
                isMajorBoss={isMajorBoss}
              />
            ))}
          </div>
        )}

        {activeTab === 'hints' && (
          <>
            {hintCount === 0 ? (
              <div className="text-[var(--text-tertiary)] font-mono text-base">No hints found</div>
            ) : (
              <section>
                <header className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-subtle)]">
                  <span className="w-1 h-6 bg-[var(--gold-500)]" />
                  <h2 className="font-display text-[14px] uppercase tracking-[0.2em] text-[var(--gold-500)]">Item Hints</h2>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                    {hintCount} items
                  </span>
                </header>
                
                <div className="space-y-3">
                  {hintsList.map((hint, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_220px] gap-x-6">
                      <ItemHintRow item={hint.item} location={hint.location} />
                      <div className="font-mono text-[12px] text-[var(--text-secondary)] text-right self-center">
                        {hint.location}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}