export const skillTree = [
  {
    path: "Ancestor",
    skills: [
      { name: "Ancestor's Blessing", desc: "+1 Spirit", effects: { Spirit: 1 } },
      { name: "Spiritual Insight", desc: "+1 Lore", effects: { Lore: 1 } },
      { name: "Holy Ground", desc: "+1 Willpower", effects: { Willpower: 1 } },
      { name: "Ancestor's Favor", desc: "+1 Max Grit", effects: { Grit: 1 } }
    ]
  },
  {
    path: "Gladiator",
    skills: [
      { name: "Battle Stance", desc: "+1 Combat", effects: { Combat: 1 } },
      { name: "Berserker Rage", desc: "+1 Strength", effects: { Strength: 1 } },
      { name: "Shield Breaker", desc: "+1 Damage on Critical", effects: {} },
      { name: "Titan's Strike", desc: "+2 Combat, -1 Initiative", effects: { Combat: 2, Initiative: -1 } }
    ]
  },
  {
    path: "Ferocity",
    skills: [
      { name: "Quick Slash", desc: "+1 Initiative", effects: { Initiative: 1 } },
      { name: "Savage Roar", desc: "+1 Willpower", effects: { Willpower: 1 } },
      { name: "Unrelenting", desc: "Reroll 1s on Combat rolls", effects: {} },
      { name: "Deep Cuts", desc: "+1 Critical Hit Range", effects: {} }
    ]
  },
  {
    path: "Tracking",
    skills: [
      { name: "Keen Eye", desc: "+1 Cunning", effects: { Cunning: 1 } },
      { name: "Hunter's Step", desc: "+1 Agility", effects: { Agility: 1 } },
      { name: "Trap Sense", desc: "Avoid traps on 5+", effects: {} },
      { name: "Predator's Path", desc: "+1 Move", effects: {} }
    ]
  }
];
