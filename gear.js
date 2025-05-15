export const gearList = [
  // Head
  { id: "sturdy_hat", name: "Sturdy Hat", slot: "Head", effects: { Defense: 1 } },
  { id: "tinker_goggles", name: "Tinker’s Goggles", slot: "Head", effects: { Lore: 1, Cunning: 1 }, darkStone: false },

  // Torso
  { id: "leather_vest", name: "Leather Vest", slot: "Torso", effects: { Willpower: 1 } },
  { id: "iron_chestplate", name: "Iron Chestplate", slot: "Torso", effects: { Defense: 2 }, weight: 2 },

  // Coat
  { id: "duster_coat", name: "Duster Coat", slot: "Coat", effects: { Spirit: 1, Health: 2 } },
  { id: "flamecoat", name: "Flamecoat", slot: "Coat", effects: { Lore: 1 }, darkStone: true },

  // Gloves
  { id: "brass_knuckles", name: "Brass Knuckles", slot: "Gloves", effects: { Strength: 1 } },
  { id: "alchemists_gloves", name: "Alchemist’s Gloves", slot: "Gloves", effects: { Cunning: 1, Luck: 1 } },

  // Hands
  { id: "steel_blade", name: "Steel Blade", slot: "Hands", effects: { Combat: 1 }, twoHanded: false },
  { id: "warhammer", name: "Warhammer", slot: "Hands", effects: { Combat: 2, Strength: 1 }, twoHanded: true },

  // Feet
  { id: "boots_of_swiftness", name: "Boots of Swiftness", slot: "Feet", effects: { Agility: 2 } },
  { id: "iron_greaves", name: "Iron Greaves", slot: "Feet", effects: { Defense: 1 }, weight: 1 },

  // Pants
  { id: "reinforced_pants", name: "Reinforced Pants", slot: "Pants", effects: { Health: 1 } },

  // Shoulders
  { id: "spiked_shoulders", name: "Spiked Shoulders", slot: "Shoulders", effects: { Strength: 1 } },

  // Face
  { id: "bone_mask", name: "Bone Mask", slot: "Face", effects: { Willpower: 1 }, darkStone: true },

  // Extras
  { id: "lucky_dice", name: "Lucky Dice", slot: "Extra 1", effects: { Luck: 2 }, upgradeSlots: 1 },
  { id: "ancient_relic", name: "Ancient Relic", slot: "Extra 2", effects: { Lore: 2 }, darkStone: true }
];
