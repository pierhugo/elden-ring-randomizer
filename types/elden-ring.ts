export interface ItemPlacement {
  originalItem?: string;
  newItem?: string;
  location: string;
  region?: string;
  source?: string;
  sourceType?: 'shop' | 'pickup' | 'drop' | 'enemy' | 'quest' | 'chest' | 'other';
  type: 'weapon' | 'armor' | 'talisman' | 'spell' | 'consumable' | 'material' | 'key-item' | 'other' | 'upgrade';
  cost?: number;
}

export interface BossPlacement {
  boss: string;
  location: string;
  region?: string;
  originalBoss?: string;
  newBoss?: string;
  scaling?: {
    from: number;
    to: number;
  };
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
