import { RandomizerSeed, ItemPlacement, BossPlacement } from '@/types/elden-ring';

export function parseLogFile(content: string): Partial<RandomizerSeed> {
  const result: Partial<RandomizerSeed> = {
    hints: { keyItems: {}, bellBearings: {} },
    spoilers: [],
    bossPlacements: [],
    options: [],
  };
  
  const lines = content.split('\n');
  
  // Parse seed and version
  const headerLine = lines[0] || '';
  const seedMatch = headerLine.match(/seed:(\d+)/);
  if (seedMatch) {
    result.seed = parseInt(seedMatch[1]);
  }
  
  const versionLine = lines.find(l => l.startsWith('Version:'));
  if (versionLine) {
    result.version = versionLine.split(':')[1]?.trim();
  }
  
  // Parse options
  const optionsMatch = headerLine.match(/Options and seed: (.+) seed:/);
  if (optionsMatch) {
    result.options = optionsMatch[1].trim().split(' ');
  }

  // Parse sections
  let inBossPlacements = false;
  let inMinibossPlacements = false;
  let inKeyItems = false;
  let inBellBearings = false;
  let inSpoilers = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Section detection - handle \r\n line endings
    const normalizedLine = line.replace(/\r$/, '');
    
    if (normalizedLine.includes('-- Boss placements')) {
      inBossPlacements = true;
      inMinibossPlacements = false;
      inKeyItems = false;
      inBellBearings = false;
      inSpoilers = false;
      if (typeof window !== 'undefined') {
        console.log('Found Boss placements section');
      }
      continue;
    }
    if (normalizedLine.includes('-- Miniboss placements')) {
      inBossPlacements = false;
      inMinibossPlacements = true;
      continue;
    }
    if (normalizedLine.includes('-- Hints for key items:')) {
      inBossPlacements = false;
      inMinibossPlacements = false;
      inKeyItems = true;
      inBellBearings = false;
      inSpoilers = false;
      continue;
    }
    if (normalizedLine.includes('-- Hints for bell bearings:')) {
      inBossPlacements = false;
      inMinibossPlacements = false;
      inKeyItems = false;
      inBellBearings = true;
      inSpoilers = false;
      continue;
    }
    if (normalizedLine.includes('-- Spoilers:')) {
      inBossPlacements = false;
      inMinibossPlacements = false;
      inKeyItems = false;
      inBellBearings = false;
      inSpoilers = true;
      continue;
    }
    if (normalizedLine.includes('-- End of hints') || (normalizedLine.includes('-- ') && !normalizedLine.includes('placements') && !normalizedLine.includes('Hints'))) {
      inBossPlacements = false;
      inMinibossPlacements = false;
      inKeyItems = false;
      inBellBearings = false;
      inSpoilers = false;
    }

    // Parse boss placements (ignore miniboss placements as per user request)
    if (inBossPlacements && trimmedLine.startsWith('Replacing ') && trimmedLine.includes(' in ') && trimmedLine.includes(': ')) {
      const match = trimmedLine.match(/^Replacing (.+?) in (.+?): (.+?) from (.+?)(?: \(scaling \d+->\d+\))?$/);
      if (match) {
        const [, originalBoss, location, newBoss] = match;

        // Remove (#xxxxxx) IDs from boss names
        const cleanOriginalBoss = originalBoss.replace(/\(#\d+\)/g, '').trim();
        const cleanNewBoss = newBoss.replace(/\(#\d+\)/g, '').trim();
        
        if (result.bossPlacements) {
          result.bossPlacements.push({
            boss: cleanNewBoss,
            location: location.trim(),
            originalBoss: cleanOriginalBoss,
            newBoss: cleanNewBoss,
          });
        }
      }
    }

    // Parse key items hints
    if (inKeyItems && trimmedLine.includes(': In ')) {
      const [item, location] = trimmedLine.split(': In ');
      if (item && location && result.hints?.keyItems) {
        const cleanItem = item.replace(/\(#\d+\)/g, '').trim();
        result.hints.keyItems[cleanItem] = location.trim();
      }
    }

    // Parse bell bearings hints
    if (inBellBearings && trimmedLine.includes(': In ')) {
      const [item, location] = trimmedLine.split(': In ');
      if (item && location && result.hints?.bellBearings) {
        const cleanItem = item.replace(/\(#\d+\)/g, '').trim();
        result.hints.bellBearings[cleanItem] = location.trim();
      }
    }

    // Parse spoilers (item placements)
    if (inSpoilers && trimmedLine.includes(' in ') && trimmedLine.includes(': Replaces ')) {
      const match = trimmedLine.match(/^(.+?) in (.+?): Replaces (.+?)\.(?:\s+\(cost: (\d+)\))?$/);
      if (match) {
        const [, newItem, location, originalItem, cost] = match;
        const placement: ItemPlacement = {
          originalItem: originalItem.trim(),
          newItem: newItem.trim(),
          location: location.trim(),
          type: getItemType(newItem.trim()),
        };
        if (cost) {
          placement.cost = parseInt(cost);
        }
        result.spoilers?.push(placement);
      }
    }
  }

  if (typeof window !== 'undefined') {
    console.log('Parse complete. Boss placements:', result.bossPlacements?.length || 0);
  }

  return result;
}

function getItemType(item: string): ItemPlacement['type'] {
  if (item.includes('Sword') || item.includes('Axe') || item.includes('Spear') || 
      item.includes('Bow') || item.includes('Staff') || item.includes('Seal') ||
      item.includes('Whip') || item.includes('Fist') || item.includes('Katana') ||
      item.includes('Halberd') || item.includes('Greataxe') || item.includes('Greathammer')) {
    return 'weapon';
  }
  if (item.includes('Spell') || item.includes('Incantation') || item.includes('Sorcery') ||
      item.includes('Glintstone') || item.includes('Stars') || item.includes('Bubble')) {
    return 'spell';
  }
  if (item.includes('Armor') || item.includes('Helm') || item.includes('Gauntlets') ||
      item.includes('Greaves') || item.includes('Robes') || item.includes('Shirt')) {
    return 'armor';
  }
  if (item.includes('Cookbook') || item.includes('Note:') || item.includes('Rune')) {
    return 'consumable';
  }
  if (item.includes('Key') || item.includes('Medalion') || (item.includes('Rune') && item.includes('Great'))) {
    return 'key-item';
  }
  if (item.includes('Smithing') || item.includes('Whetblade') || item.includes('Bell Bearing')) {
    return 'upgrade';
  }
  return 'consumable';
}

// For client-side usage with uploaded file
export function parseUploadedLog(text: string): Partial<RandomizerSeed> {
  return parseLogFile(text);
}
