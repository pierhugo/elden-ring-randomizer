"use client";

import { useState, useEffect } from "react";
import { parseUploadedLog } from "@/lib/parser";

interface Placement {
  boss: string;
  originalBoss: string;
  scaling?: { from: number; to: number };
  location: string;
}

interface Item {
  newItem?: string;
  originalItem?: string;
  location: string;
  type: string;
  cost?: number;
}

export default function Home() {
  const [seedData, setSeedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"bosses" | "hints" | "items">(
    "hints",
  );

  const isMajorBoss = (bossName: string) => {
    const majorBosses = [
      "Radahn",
      "Messmer",
      "Godfrey",
      "Maliketh",
      "Mohg",
      "Romina",
      "Omen King",
      "Malenia",
      "Rellana",
      "Midra",
      "Bayle",
      "Radagon",
      "Placidusax",
      "Godrick",
      "Margit",
      "Putrescent Knight",
      "Divine Beast Dancing Lion",
      "Commander Gaius",
      "Rykard",
      "Niall",
      "Fortissax",
      "Godskin Duo",
      "Scadutree Avatar",
      "Golden Hippopotamus",
      "Rennala",
      "Loretta",
      "Metyr",
      "Astel",
      "Regal Ancestor Spirit",
      "Fire Giant",
      "Elden Beast",
    ];
    return majorBosses.some(
      (mb) => bossName.toLowerCase().includes(mb.toLowerCase()) || mb.toLowerCase().includes(bossName.toLowerCase())
    );
  };

  useEffect(() => {
    fetch("/default-log.txt")
      .then((res) => res.text())
      .then((content) => {
        const parsed = parseUploadedLog(content);
        setSeedData(parsed);
      })
      .catch((err) => console.error("Failed to load default log:", err));
  }, []);

  const formatLocationName = (location: string) => {
    return location
      .split("-")
      .map((p) =>
        p
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      )
      .join(" - ");
  };

  const hintsList = seedData?.hints?.keyItems
    ? Object.entries(seedData.hints.keyItems).map(([item, location]) => ({
        item,
        location: (location as string).replace(": ", ""),
      }))
    : [];

  const bossesList = seedData?.bossPlacements || [];

  if (!seedData) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--text-tertiary)] font-mono text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center gap-1">
            {(["hints", "bosses", "items"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 font-mono text-[12px] uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? "text-[var(--gold-500)] border-b-2 border-[var(--gold-500)] -mb-[1px]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {tab}{" "}
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={() => window.open("/default-log.txt", "_blank")}
                className="px-5 py-4 font-mono text-[12px] uppercase tracking-wider text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                View Log
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 py-8">
        {activeTab === "bosses" && (
          <div>
            <div className="space-y-1">
              {bossesList.map((placement: Placement, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-1">
                    {isMajorBoss(placement.boss) && (
                      <svg
                        className="w-4 h-4 text-[var(--gold-500)] shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                      </svg>
                    )}
                    <span className="text-[13px] text-[var(--text-secondary)] font-semibold">
                      {placement.boss}
                      {placement.scaling && (
                        <span className="font-mono text-[10px] text-[var(--gold-500)] bg-[var(--bg-primary)] px-1.5 py-0.5 rounded-full ml-1">
                          {placement.scaling.from}
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] text-[var(--text-tertiary)] font-normal ml-2">
                      {placement.originalBoss}
                      {placement.scaling && (
                        <span className="font-mono text-[10px] text-[var(--gold-500)] bg-[var(--bg-primary)] px-1.5 py-0.5 rounded-full ml-1">
                          {placement.scaling.to}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)] text-right min-w-[180px]">
                    {formatLocationName(placement.location)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hints" && (
          <div>
            <div className="space-y-1">
              {hintsList.map(
                (hint: { item: string; location: string }, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-[var(--text-secondary)] font-semibold">
                        {hint.item}
                      </span>
                    </div>
                    <span className="font-mono text-[12px] text-[var(--text-tertiary)] text-right min-w-[180px]">
                      {formatLocationName(hint.location)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {activeTab === "items" && (
          <div>
            <div className="space-y-1">
              {(seedData?.spoilers || []).map((item: Item, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] text-[var(--text-secondary)] font-semibold leading-tight">
                      {item.newItem || item.originalItem}
                    </span>
                    <span className="text-[13px] text-[var(--text-tertiary)] font-normal ml-2">
                      {item.newItem &&
                        item.originalItem &&
                        item.newItem !== item.originalItem &&
                        item.originalItem}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-[var(--text-tertiary)] text-right min-w-[180px]">
                      {formatLocationName(item.location)}
                    </span>
                    {item.cost && (
                      <span className="font-mono text-[10px] text-[var(--gold-500)] shrink-0">
                        {item.cost}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
