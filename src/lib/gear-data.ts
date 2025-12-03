// Gear slot types
export const GEAR_SLOTS = {
  helmet: { name: "Helmet", icon: "👑" },
  chest: { name: "Chest", icon: "👘" },
  weapon: { name: "Weapon", icon: "⚔️" },
  gloves: { name: "Gloves", icon: "🧤" },
  legs: { name: "Legs", icon: "👖" },
  boots: { name: "Boots", icon: "👢" },
  accessory1: { name: "Accessory 1", icon: "💍" },
  accessory2: { name: "Accessory 2", icon: "📿" },
} as const;

export type GearSlot = keyof typeof GEAR_SLOTS;

// Troop types
export const TROOP_TYPES = ["infantry", "cavalry", "archer", "siege"] as const;
export type TroopType = typeof TROOP_TYPES[number];

// Stat types
export const STAT_TYPES = ["attack", "defense", "health"] as const;
export type StatType = typeof STAT_TYPES[number];

// Stats structure for a gear piece
export type GearStats = {
  [K in TroopType]?: {
    [S in StatType]?: number; // percentage value
  };
};

export interface GearItem {
  name: string;
  slot: GearSlot;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  icon: string;
  stats: GearStats;
}

// Placeholder gear items with stats - each focused on ONE troop type
export const GEAR_ITEMS: Record<string, GearItem> = {
  // Helmets - Infantry
  "helm_inf_leg": {
    name: "Infantry War Helm",
    slot: "helmet",
    rarity: "legendary",
    icon: "👑",
    stats: { infantry: { attack: 5, defense: 8, health: 4 } }
  },
  "helm_inf_epic": {
    name: "Infantry Battle Helm",
    slot: "helmet",
    rarity: "epic",
    icon: "👑",
    stats: { infantry: { attack: 4, defense: 6, health: 3 } }
  },
  // Helmets - Cavalry
  "helm_cav_leg": {
    name: "Cavalry War Helm",
    slot: "helmet",
    rarity: "legendary",
    icon: "👑",
    stats: { cavalry: { attack: 6, defense: 7, health: 4 } }
  },
  "helm_cav_epic": {
    name: "Cavalry Battle Helm",
    slot: "helmet",
    rarity: "epic",
    icon: "👑",
    stats: { cavalry: { attack: 4, defense: 5, health: 3 } }
  },
  // Helmets - Archer
  "helm_arc_leg": {
    name: "Archer War Helm",
    slot: "helmet",
    rarity: "legendary",
    icon: "👑",
    stats: { archer: { attack: 7, defense: 5, health: 5 } }
  },
  "helm_arc_epic": {
    name: "Archer Battle Helm",
    slot: "helmet",
    rarity: "epic",
    icon: "👑",
    stats: { archer: { attack: 5, defense: 4, health: 3 } }
  },

  // Chest - Infantry
  "chest_inf_leg": {
    name: "Infantry Plate Armor",
    slot: "chest",
    rarity: "legendary",
    icon: "👘",
    stats: { infantry: { attack: 4, defense: 10, health: 6 } }
  },
  "chest_inf_epic": {
    name: "Infantry Chain Mail",
    slot: "chest",
    rarity: "epic",
    icon: "👘",
    stats: { infantry: { defense: 7, health: 5 } }
  },
  // Chest - Cavalry
  "chest_cav_leg": {
    name: "Cavalry Riding Cloak",
    slot: "chest",
    rarity: "legendary",
    icon: "👘",
    stats: { cavalry: { attack: 6, defense: 8, health: 6 } }
  },
  "chest_cav_epic": {
    name: "Cavalry Light Armor",
    slot: "chest",
    rarity: "epic",
    icon: "👘",
    stats: { cavalry: { attack: 4, defense: 6, health: 4 } }
  },
  // Chest - Archer
  "chest_arc_leg": {
    name: "Archer's Cloak",
    slot: "chest",
    rarity: "legendary",
    icon: "👘",
    stats: { archer: { attack: 8, defense: 6, health: 5 } }
  },
  "chest_arc_epic": {
    name: "Archer's Vest",
    slot: "chest",
    rarity: "epic",
    icon: "👘",
    stats: { archer: { attack: 5, defense: 5, health: 4 } }
  },

  // Weapons - Infantry
  "weapon_inf_leg": {
    name: "Hammer of the Silent",
    slot: "weapon",
    rarity: "legendary",
    icon: "⚔️",
    stats: { infantry: { attack: 12, defense: 4, health: 2 } }
  },
  "weapon_inf_epic": {
    name: "Infantry Sword",
    slot: "weapon",
    rarity: "epic",
    icon: "⚔️",
    stats: { infantry: { attack: 9, defense: 3 } }
  },
  // Weapons - Cavalry
  "weapon_cav_leg": {
    name: "Blade of Calamity",
    slot: "weapon",
    rarity: "legendary",
    icon: "⚔️",
    stats: { cavalry: { attack: 13, defense: 3, health: 2 } }
  },
  "weapon_cav_epic": {
    name: "Cavalry Lance",
    slot: "weapon",
    rarity: "epic",
    icon: "⚔️",
    stats: { cavalry: { attack: 10, defense: 2 } }
  },
  // Weapons - Archer
  "weapon_arc_leg": {
    name: "Bow of Precision",
    slot: "weapon",
    rarity: "legendary",
    icon: "⚔️",
    stats: { archer: { attack: 14, defense: 2, health: 2 } }
  },
  "weapon_arc_epic": {
    name: "Archer's Longbow",
    slot: "weapon",
    rarity: "epic",
    icon: "⚔️",
    stats: { archer: { attack: 10, defense: 2 } }
  },

  // Gloves - Infantry
  "gloves_inf_leg": {
    name: "Vanguard Gauntlets",
    slot: "gloves",
    rarity: "legendary",
    icon: "🧤",
    stats: { infantry: { attack: 6, defense: 6, health: 4 } }
  },
  "gloves_inf_epic": {
    name: "Infantry Gloves",
    slot: "gloves",
    rarity: "epic",
    icon: "🧤",
    stats: { infantry: { attack: 4, defense: 4, health: 3 } }
  },
  // Gloves - Cavalry
  "gloves_cav_leg": {
    name: "Rider's Grips",
    slot: "gloves",
    rarity: "legendary",
    icon: "🧤",
    stats: { cavalry: { attack: 7, defense: 5, health: 4 } }
  },
  "gloves_cav_epic": {
    name: "Cavalry Gloves",
    slot: "gloves",
    rarity: "epic",
    icon: "🧤",
    stats: { cavalry: { attack: 5, defense: 4, health: 3 } }
  },
  // Gloves - Archer
  "gloves_arc_leg": {
    name: "Eternal Night",
    slot: "gloves",
    rarity: "legendary",
    icon: "🧤",
    stats: { archer: { attack: 8, defense: 4, health: 4 } }
  },
  "gloves_arc_epic": {
    name: "Archer's Gloves",
    slot: "gloves",
    rarity: "epic",
    icon: "🧤",
    stats: { archer: { attack: 6, defense: 3, health: 3 } }
  },

  // Legs - Infantry
  "legs_inf_leg": {
    name: "Sentry's Breeches",
    slot: "legs",
    rarity: "legendary",
    icon: "👖",
    stats: { infantry: { attack: 3, defense: 10, health: 6 } }
  },
  "legs_inf_epic": {
    name: "Infantry Leggings",
    slot: "legs",
    rarity: "epic",
    icon: "👖",
    stats: { infantry: { defense: 7, health: 4 } }
  },
  // Legs - Cavalry
  "legs_cav_leg": {
    name: "Rider's Pants",
    slot: "legs",
    rarity: "legendary",
    icon: "👖",
    stats: { cavalry: { attack: 4, defense: 8, health: 6 } }
  },
  "legs_cav_epic": {
    name: "Cavalry Leggings",
    slot: "legs",
    rarity: "epic",
    icon: "👖",
    stats: { cavalry: { defense: 6, health: 5 } }
  },
  // Legs - Archer
  "legs_arc_leg": {
    name: "Archer's Greaves",
    slot: "legs",
    rarity: "legendary",
    icon: "👖",
    stats: { archer: { attack: 5, defense: 7, health: 6 } }
  },
  "legs_arc_epic": {
    name: "Archer's Pants",
    slot: "legs",
    rarity: "epic",
    icon: "👖",
    stats: { archer: { defense: 5, health: 5 } }
  },

  // Boots - Infantry
  "boots_inf_leg": {
    name: "Infantry War Boots",
    slot: "boots",
    rarity: "legendary",
    icon: "👢",
    stats: { infantry: { attack: 3, defense: 6, health: 8 } }
  },
  "boots_inf_epic": {
    name: "Infantry Boots",
    slot: "boots",
    rarity: "epic",
    icon: "👢",
    stats: { infantry: { defense: 4, health: 5 } }
  },
  // Boots - Cavalry
  "boots_cav_leg": {
    name: "Windswept Boots",
    slot: "boots",
    rarity: "legendary",
    icon: "👢",
    stats: { cavalry: { attack: 4, defense: 6, health: 8 } }
  },
  "boots_cav_epic": {
    name: "Cavalry Boots",
    slot: "boots",
    rarity: "epic",
    icon: "👢",
    stats: { cavalry: { defense: 5, health: 5 } }
  },
  // Boots - Archer
  "boots_arc_leg": {
    name: "Archer's Swift Boots",
    slot: "boots",
    rarity: "legendary",
    icon: "👢",
    stats: { archer: { attack: 5, defense: 5, health: 7 } }
  },
  "boots_arc_epic": {
    name: "Archer's Boots",
    slot: "boots",
    rarity: "epic",
    icon: "👢",
    stats: { archer: { defense: 4, health: 5 } }
  },

  // Accessories - Infantry
  "acc_inf_leg": {
    name: "Infantry Horn",
    slot: "accessory1",
    rarity: "legendary",
    icon: "💍",
    stats: { infantry: { attack: 6, defense: 5, health: 5 } }
  },
  "acc_inf_epic": {
    name: "Infantry Ring",
    slot: "accessory1",
    rarity: "epic",
    icon: "💍",
    stats: { infantry: { attack: 4, defense: 3, health: 3 } }
  },
  // Accessories - Cavalry
  "acc_cav_leg": {
    name: "Cavalry Talisman",
    slot: "accessory1",
    rarity: "legendary",
    icon: "💍",
    stats: { cavalry: { attack: 7, defense: 4, health: 5 } }
  },
  "acc_cav_epic": {
    name: "Cavalry Ring",
    slot: "accessory1",
    rarity: "epic",
    icon: "💍",
    stats: { cavalry: { attack: 5, defense: 3, health: 3 } }
  },
  // Accessories - Archer
  "acc_arc_leg": {
    name: "Archer's Amulet",
    slot: "accessory1",
    rarity: "legendary",
    icon: "💍",
    stats: { archer: { attack: 8, defense: 3, health: 5 } }
  },
  "acc_arc_epic": {
    name: "Archer's Ring",
    slot: "accessory1",
    rarity: "epic",
    icon: "💍",
    stats: { archer: { attack: 5, defense: 3, health: 3 } }
  },
  // Accessories - Siege
  "acc_siege_leg": {
    name: "Siege Engine Core",
    slot: "accessory1",
    rarity: "legendary",
    icon: "💍",
    stats: { siege: { attack: 10, defense: 4, health: 4 } }
  },
  "acc_siege_epic": {
    name: "Siege Ring",
    slot: "accessory1",
    rarity: "epic",
    icon: "💍",
    stats: { siege: { attack: 7, defense: 3, health: 3 } }
  },
};

// Using inline style values instead of Tailwind classes for dynamic usage
export const RARITY_STYLES = {
  common: {
    gradient: "linear-gradient(to bottom right, #9ca3af, #6b7280)",
    border: "#6b7280"
  },
  uncommon: {
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    border: "#22c55e"
  },
  rare: {
    gradient: "linear-gradient(to bottom right, #60a5fa, #2563eb)",
    border: "#3b82f6"
  },
  epic: {
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    border: "#a855f7"
  },
  legendary: {
    gradient: "linear-gradient(to bottom right, #fbbf24, #f97316)",
    border: "#f59e0b"
  },
} as const;

// Keep for backward compatibility but not used for dynamic styling
export const RARITY_COLORS = {
  common: "from-gray-400 to-gray-500",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-orange-500",
} as const;

export const RARITY_BORDER = {
  common: "border-gray-500",
  uncommon: "border-green-500",
  rare: "border-blue-500",
  epic: "border-purple-500",
  legendary: "border-amber-500",
} as const;

export const TROOP_ICONS = {
  infantry: "🛡️",
  cavalry: "🐎",
  archer: "🏹",
  siege: "🏰",
} as const;

export const STAT_ICONS = {
  attack: "⚔️",
  defense: "🛡️",
  health: "❤️",
} as const;

export function getGearForSlot(slot: GearSlot) {
  return Object.entries(GEAR_ITEMS)
    .filter(([_, gear]) => gear.slot === slot || (slot === "accessory2" && gear.slot === "accessory1"))
    .map(([id, gear]) => ({ id, ...gear }));
}

// Calculate total stats from equipped gear
export function calculateSetStats(equippedGear: (string | null)[]): GearStats {
  const totalStats: GearStats = {};

  for (const gearId of equippedGear) {
    if (!gearId || !GEAR_ITEMS[gearId]) continue;

    const gear = GEAR_ITEMS[gearId];
    for (const troopType of TROOP_TYPES) {
      if (!gear.stats[troopType]) continue;

      if (!totalStats[troopType]) {
        totalStats[troopType] = {};
      }

      for (const statType of STAT_TYPES) {
        const value = gear.stats[troopType]?.[statType];
        if (value) {
          totalStats[troopType]![statType] = (totalStats[troopType]![statType] || 0) + value;
        }
      }
    }
  }

  return totalStats;
}
