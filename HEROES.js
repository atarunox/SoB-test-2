window.HEROES = {
  Western: {
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
        "Rough Rider: Recover 1 Grit on D6 roll of 4+ if you have no Grit.",
        "Happy Trails: Once per Travel, spend 1 Grit to cancel a Travel Hazard on 3+."
      ],
      items: ["Pistol", "Lasso", "Bandana"]
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
        "Hunter's Reflexes: +1 Damage vs Beasts. +2 Initiative on first turn of Ambush.",
        "Primitive: May not use Guns, Books, or Tech Items.",
        "OtherWorld Native (Jargono): +3 Lore in Swamps of Jargono."
      ],
      items: ["Tribal Shield", "Dark Stone Blade"]
    }
  }
};

console.log("HEROES.js loaded");
