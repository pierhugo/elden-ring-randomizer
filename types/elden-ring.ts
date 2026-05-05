export interface ItemPlacement {
  originalItem?: string;
  newItem?: string;
  location: string;
  type: 'weapon' | 'armor' | 'talisman' | 'spell' | 'consumable' | 'material' | 'key-item' | 'other' | 'upgrade';
  cost?: number;
}

export interface BossPlacement {
  boss: string;
  location: string;
  originalBoss?: string;
  newBoss?: string;
}

export interface RandomizerSeed {
  seed: number;
  version?: string;
  options: string[];
  hints: {
    keyItems: Record<string, string>;
    bellBearings: Record<string, string>;
  };
  spoilers: ItemPlacement[];
  bossPlacements: BossPlacement[];
  minibossPlacements?: BossPlacement[];
}
