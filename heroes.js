
// heroes.js - Western heroes
const HEROES = {
  "Western": {
    "Trederran Veteran": {
      stats: { Agility: 2, Cunning: 3, Spirit: 2, Strength: 3, Lore: 1, Luck: 4, Initiative: 4 },
      combat: 2,
      maxGrit: 2,
      toHit: { ranged: "3+", melee: "4+" },
      health: 11,
      sanity: 11,
      defense: "4+",
      willpower: "4+",
      abilities: [
        "Trederran Faction: Starts with a Trederran Veteran Faction card of your choice.",
        "Battle-Hardened: Defense 3+ vs ranged. No adjacency target required.",
        "OtherWorld Native (Trederra): +3 Lore in Trederra. Starts with a Trederra Personal Item."
      ],
      items: ["Trusty Trench Pistol", "Worn Trench Coat", "Veteranâ€™s Breath Mask"]
    },
    "Cowboy": {
      stats: { Agility: 2, Cunning: 3, Spirit: 1, Strength: 4, Lore: 3, Luck: 2, Initiative: 3 },
      combat: 2,
      maxGrit: 2,
      toHit: { ranged: "4+", melee: "4+" },
      health: 14,
      sanity: 12,
      defense: "4+",
      willpower: "4+",
      abilities: [
        "Rough Rider: Recover 1 Grit on D6 roll of 4+ if you have no Grit (start of each Turn/Day in Town).",
        "Happy Trails: Once per Travel, spend 1 Grit to cancel a Travel Hazard on a D6 roll of 3+."
      ],
      items: ["Pistol", "Lasso", "Bandana"]
    },
    "Prospector": {
      stats: { Agility: 1, Cunning: 2, Spirit: 2, Strength: 4, Lore: 3, Luck: 3, Initiative: 2 },
      combat: 2,
      maxGrit: 2,
      toHit: { ranged: "5+", melee: "4+" },
      health: 16,
      sanity: 14,
      defense: "4+",
      willpower: "5+",
      abilities: [
        "Crotchety: May not use Guns or Tech items.",
        "Expert Miner: Double Gold and Dark Stone from loot/scavenge/encounter cards.",
        "Death Blow: 8+ to-hit rolls double damage (only for D8-based weapons)."
      ],
      items: ["Heavy Pick Axe", "Minerâ€™s Canteen"]
    },
    "Jargono Native": {
      stats: { Agility: 4, Cunning: 2, Spirit: 3, Strength: 3, Lore: 1, Luck: 2, Initiative: 4 },
      combat: 2,
      maxGrit: 2,
      toHit: { ranged: "5+", melee: "4+" },
      health: 11,
      sanity: 11,
      defense: "4+",
      willpower: "4+",
      abilities: [
        "Hunterâ€™s Reflexes: +1 Damage vs Beasts. +2 Initiative on first turn of an Ambush.",
        "Primitive: May not use Guns, Books, or Tech Items.",
        "OtherWorld Native (Jargono): Starts with a Swamps of Jargono Personal Item. +3 Lore in Swamps of Jargono."
      ],
      items: ["Tribal Shield", "Dark Stone Blade"]
    },
    "Dark Stone Shaman": {
      stats: { Agility: 2, Cunning: 1, Spirit: 4, Strength: 2, Lore: 4, Luck: 1, Initiative: 3 },
      combat: 2,
      maxGrit: 2,
      toHit: { ranged: "5+", melee: "4+" },
      health: 10,
      sanity: 12,
      defense: "4+",
      willpower: "3+",
      abilities: [
        "Magik 3",
        "Tribal Shaman: Starts with 1 random Spirit Magik spell (draw 2, choose 1). May not use Guns, Explosives, or Tech Items.",
        "Dark Stone Enhancement: Discard Dark Stone to add 2 extra casting dice."
      ],
      items: ["Shaman Staff", "Dark Stone Satchel"]
    },
    "Drifter": {
      stats: { Agility: 2, Cunning: 3, Spirit: 3, Strength: 2, Lore: 4, Luck: 1, Initiative: 5 },
      combat: 2,
      maxGrit: 3,
      toHit: { ranged: "3+", melee: "4+" },
      health: 10,
      sanity: 12,
      defense: "4+",
      willpower: "3+",
      abilities: [
        "Long Years Experience: Not restricted to targeting adjacent enemies. Starts with 2 Personal Items.",
        "Distrustful: -1 Initiative per adjacent Hero (min 1).",
        "Danger Magnet: All Enemies gain 1 Elite ability. Add D3 Travel Hazards in Town."
      ],
      items: ["Trusty Pistol", "Starting Upgrade", "Drifterâ€™s Secret"]
    }
  }
};
