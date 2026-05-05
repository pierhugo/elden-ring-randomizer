'use client';

import { useState, useEffect } from 'react';
import { parseUploadedLog } from '@/lib/parser';

export default function Home() {
  const [seedData, setSeedData] = useState<any>(null);

  useEffect(() => {
    fetch('/default-log.txt')
      .then(res => res.text())
      .then(content => {
        const parsed = parseUploadedLog(content);
        setSeedData(parsed);
      })
      .catch(err => console.error('Failed to load default log:', err));
  }, []);

  // Group boss placements by major region
  const bossPlacementsByRegion = seedData?.bossPlacements?.reduce((acc: Record<string, Record<string, any[]>>, placement: any) => {
    const location = placement.location;
    const parts = location.split('-');
    const majorRegion = parts[0];
    if (!acc[majorRegion]) acc[majorRegion] = {};
    if (!acc[majorRegion][location]) acc[majorRegion][location] = [];
    acc[majorRegion][location].push(placement);
    return acc;
  }, {} as Record<string, Record<string, any[]>>) || {};

  // Group item hints by location
  const itemHintsByLocation = seedData?.hints?.keyItems ?
    Object.entries(seedData.hints.keyItems).reduce((acc: Record<string, string[]>, [item, hint]) => {
      const hintStr = hint as string;
      const location = hintStr.split(': ')[1] || hintStr;
      if (!acc[location]) acc[location] = [];
      acc[location].push(item);
      return acc;
    }, {} as Record<string, string[]>) : {};

  // Format location name
  const formatLocationName = (location: string) => {
    const parts = location.split('-');
    return parts.slice(1).map((p: string) => p.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' - ');
  };

  // Format region name
  const formatRegionName = (region: string) => {
    return region.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <main className="min-h-screen bg-[#020617] text-[#F8FAFC] font-['Fira_Sans',sans-serif]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#22C55E] flex items-center justify-center">
                <span className="text-black font-['Fira_Code',monospace] font-bold text-sm">ER</span>
              </div>
              <div>
                <h1 className="text-lg font-['Fira_Code',monospace] font-bold tracking-wider">ELDEN RING</h1>
                <p className="text-[10px] text-[#94A3B8] font-['Fira_Code',monospace] tracking-widest -mt-0.5">RANDOMIZER TRACKER</p>
              </div>
            </div>
            {seedData && (
              <div className="text-right">
                <div className="text-[10px] text-[#64748B] font-['Fira_Code',monospace] uppercase tracking-wider">Seed</div>
                <div className="text-xl text-[#22C55E] font-['Fira_Code',monospace] font-bold">{seedData.seed}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {seedData ? (
          <div className="space-y-12">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Bosses', value: seedData.bossPlacements?.length || 0, color: '#EF4444' },
                { label: 'Locations', value: Object.keys(bossPlacementsByRegion).length, color: '#22C55E' },
                { label: 'Items', value: Object.keys(itemHintsByLocation).length, color: '#F59E0B' },
                { label: 'Version', value: seedData.version || 'N/A', color: '#3B82F6' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-[#1E293B] p-4 hover:border-[#334155] transition-colors">
                  <div className="text-[10px] text-[#64748B] font-['Fira_Code',monospace] uppercase tracking-wider mb-1">{stat.label}</div>
                  <div className="text-2xl font-['Fira_Code',monospace] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Boss Placements - All Visible */}
            {Object.keys(bossPlacementsByRegion).length > 0 && (
              <section>
                <h2 className="text-2xl font-['Fira_Code',monospace] font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#EF4444]">▶</span> Boss Placements
                </h2>
                
                <div className="space-y-8">
                  {Object.entries(bossPlacementsByRegion).map(([region, locations]) => (
                    <div key={region}>
                      <h3 className="text-lg text-[#22C55E] font-['Fira_Code',monospace] font-bold mb-4 pb-2 border-b border-[#1E293B] flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#22C55E] inline-block" />
                        {formatRegionName(region)}
                        <span className="text-xs text-[#64748B] font-['Fira_Code',monospace]">
                          ({Object.keys(locations as Record<string, any[]>).length} locations)
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                        {Object.entries(locations as Record<string, any[]>).map(([location, placements]) => (
                          <div key={location} className="bg-[#0F172A] border border-[#1E293B] p-4 hover:border-[#334155] transition-all duration-200">
                            <h4 className="text-sm text-[#94A3B8] font-['Fira_Code',monospace] mb-3 pb-2 border-b border-[#1E293B]">
                              {formatLocationName(location)}
                            </h4>
                            <div className="space-y-2">
                              {(placements as any[]).map((placement: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="group p-3 bg-[#020617] border border-[#1E293B] hover:border-[#EF4444]/50 transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="text-[#EF4444] font-['Fira_Code',monospace] text-sm font-bold">
                                        {placement.boss}
                                      </div>
                                      <div className="text-[#64748B] text-[10px] font-['Fira_Code',monospace] mt-1">
                                        Was: {placement.originalBoss}
                                      </div>
                                    </div>
                                    <div className="w-2 h-2 bg-[#EF4444] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Item Hints - Styled like Boss Cards */}
            {Object.keys(itemHintsByLocation).length > 0 && (
              <section>
                <h2 className="text-2xl font-['Fira_Code',monospace] font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#F59E0B]">▶</span> Item Hints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(itemHintsByLocation).map(([location, items]) => (
                    <div key={location} className="bg-[#0F172A] border border-[#1E293B] p-4 hover:border-[#F59E0B]/50 transition-all duration-200">
                      <h3 className="text-sm text-[#F59E0B] font-['Fira_Code',monospace] font-bold mb-3 pb-2 border-b border-[#1E293B] flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#F59E0B] inline-block" />
                        {location}
                      </h3>
                      <div className="space-y-2">
                        {items.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#020617] border border-[#1E293B] hover:border-[#F59E0B]/30 transition-all duration-200"
                          >
                            <div className="text-[#CBD5E1] font-['Fira_Code',monospace] text-xs">
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[600px]">
            <div className="w-12 h-12 border-2 border-[#22C55E] border-t-transparent animate-spin mb-4" />
            <div className="text-[#94A3B8] font-['Fira_Code',monospace] text-lg">Loading seed data...</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-['Fira_Code',monospace] text-xs text-[#334155]">
            Elden Ring Randomizer Tracker • Seed {seedData?.seed || '...'}
          </p>
        </div>
      </footer>
    </main>
  );
}
