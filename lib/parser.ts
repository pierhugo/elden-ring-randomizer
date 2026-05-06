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
      const match = trimmedLine.match(/^Replacing (.+?) in (.+?): (.+?) from (.+)$/);
      if (match) {
        const [, originalBoss, location, newBoss, fromLocation] = match;

        // Remove (#xxxxxx) IDs from boss names
        const cleanOriginalBoss = originalBoss.replace(/\(#\d+\)/g, '').trim();
        const cleanNewBoss = newBoss.replace(/\(#\d+\)/g, '').trim();

        // Extract scaling from the "from" location if present
        const scalingMatch = fromLocation.match(/^(.+?) \(scaling (\d+)->(\d+)\)$/);
        let cleanFromLocation = fromLocation;
        let scaling = undefined;

        if (scalingMatch) {
          cleanFromLocation = scalingMatch[1];
          scaling = {
            from: parseInt(scalingMatch[2]),
            to: parseInt(scalingMatch[3]),
          };
        }

        const placement: BossPlacement = {
          boss: cleanNewBoss,
          location: location.trim(),
          region: getRegionFromLocation(location.trim()),
          originalBoss: cleanOriginalBoss,
          newBoss: cleanNewBoss,
          scaling,
        };
        
        if (result.bossPlacements) {
          result.bossPlacements.push(placement);
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
    // Format: NewItem in Location: SourceInfo. Replaces OriginalItem. (cost: N)
    if (inSpoilers && trimmedLine.includes(' in ') && trimmedLine.includes('Replaces ')) {
      const match = trimmedLine.match(/^(.+?) in (.+?): (.*?) Replaces (.+?)\.?(?:\s+\(cost: (\d+)\))?$/);
      if (match) {
        const [, newItem, location, source, originalItem, cost] = match;
        const placement: ItemPlacement = {
          originalItem: originalItem.trim(),
          newItem: newItem.trim(),
          location: location.trim(),
          region: getRegionFromLocation(location.trim()),
          source: source.trim(),
          sourceType: getSourceType(source.trim()),
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
  if (item.includes('Talisman')) {
    return 'talisman';
  }
  if (item.includes('Cookbook') || item.includes('Note:')) {
    return 'consumable';
  }
  if (item.includes('Key') || item.includes('Medalion') || (item.includes('Rune') && item.includes('Great'))) {
    return 'key-item';
  }
  if (item.includes('Smithing') || item.includes('Whetblade') || item.includes('Bell Bearing')) {
    return 'upgrade';
  }
  if (item.includes('Stone') || item.includes('Crystal Tear') || item.includes('Ash of War')) {
    return 'material';
  }
  return 'consumable';
}

const REGION_MAP: Record<string, string[]> = {
  'Limgrave': ['Gatefront', 'Ship', 'Dragon Burn', 'Murkwater', 'Mistwood', 'Cliffbottom', 'Stilwater', 'Watermea', 'Seaside', 'Lun山东', 'Fort', 'Waypoint'],
  'Stormveil': ['Stormveil', 'Gate'],
  'Liurnia': ['Liurnia', 'Raya Lucaria', 'Academy', 'Ranni', 'Finger', 'Carian', 'Boil', 'Presbytery', 'Rose Church', 'Fallgrim', 'Temple of Eiglay'],
  'Caelid': ['Caelid', 'Redmane', 'Caria', 'Swamp', 'War-Dead', 'Imps', 'Cathedral of Dragon Communion', 'Bestial Sanctum'],
  'Deeproot Depths': ['Deeproot', ' Nameless', 'Prince of Death', 'Cathedral of Full'],
  'Mountaintops of the Giants': ['Mountaintops', 'Helphen', 'Stoneside', 'Snowfield', 'Wailing', 'Garden of Remem'],
  'Crumbling Farum Azula': ['Crumbling Farum Azula', 'Farum Azula', 'Ashen', 'Beast'],
  'Leyndell': ['Leyndell', 'Capital', 'Erdtree', 'Ashen Capital'],
  'Consecrated Snowfield': ['Consecrated Snowfield', 'Ordina', 'Annewn', 'Ritual'],
  'Miquella\'s Haligtree': ['Miquella', 'Haligtree', 'Elphael', 'Consecrated'],
  'Mohgwyn Palace': ['Mohgwyn', 'Palace', 'Cocoon'],
  'Malefactor\'s Evergaol': ['Malefactor', 'Evergaol'],
};

function getRegionFromLocation(location: string): string | undefined {
  const lower = location.toLowerCase();
  
  for (const [region, keywords] of Object.entries(REGION_MAP)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return region;
      }
    }
  }
  
  return undefined;
}

function getSourceType(source: string): ItemPlacement['sourceType'] {
  const lower = source.toLowerCase();
  if (lower.includes('sold by') || lower.includes('shop') || lower.includes('at the') || lower.includes('for ')) {
    return 'shop';
  }
  if (lower.includes('dropped by') || lower.includes('defeating')) {
    return 'enemy';
  }
  if (lower.includes('given by') || lower.includes('quest')) {
    return 'quest';
  }
  if (lower.includes('chest') || lower.includes('caravan') || lower.includes('coffin')) {
    return 'chest';
  }
  if (lower.includes('from small scarab') || lower.includes('from scarab')) {
    return 'drop';
  }
  if (lower.includes('from')) {
    return 'drop';
  }
  if (lower.includes('in ') || lower.includes('inside')) {
    return 'pickup';
  }
  if (lower.includes('looping')) {
    return 'pickup';
  }
  return 'other';
}

// For client-side usage with uploaded file
export function parseUploadedLog(text: string): Partial<RandomizerSeed> {
  return parseLogFile(text);
}
