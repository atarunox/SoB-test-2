export const skillTree = [
  {
    path: "Ancestor",
    skills: [
      { name: "Blessing of the Ancients", desc: "+1 Spirit", effects: { Spirit: 1 } },
      { name: "Spiritual Guidance", desc: "+1 Lore", effects: { Lore: 1 } },
      { name: "Guardian Totem", desc: "+1 Defense", effects: { Defense: 1 } },
      { name: "Ancestorâ€™s Favor", desc: "May recover 1 Grit once per Adventure", effects: { Grit: 1 } }
    ]
  },
  {
    path: "Gladiator",
    skills: [
      { name: "Brawlerâ€™s Strength", desc: "+1 Combat", effects: { Combat: 1 } },
      { name: "Battle Focus", desc: "+1 Willpower", effects: { Willpower: 1 } },
      { name: "Unyielding", desc: "+2 Max Health", effects: { Health: 2 } },
      { name: "Final Blow", desc: "+1 Damage on Critical Hits", effects: {} }
    ]
  },
  {
    path: "Ferocity",
    skills: [
      { name: "Quick Strike", desc: "+1 Initiative", effects: { Initiative: 1 } },
      { name: "Savage Roar", desc: "Enemies within 3 spaces are -1 Defense", effects: {} },
      { name: "Reckless Charge", desc: "+1 Move, +1 Combat this turn", effects: {} },
      { name: "Deep Cuts", desc: "Critical Hits cause Bleeding", effects: {} }
    ]
  },
  {
    path: "Tracking",
    skills: [
      { name: "Hunterâ€™s Eye", desc: "+1 Cunning", effects: { Cunning: 1 } },
      { name: "Pathfinder", desc: "May ignore terrain penalties", effects: {} },
      { name: "Beast Lore", desc: "+1 to hit Beasts", effects: {} },
      { name: "Master Tracker", desc: "+1 Luck, +1 Lore", effects: { Luck: 1, Lore: 1 } }
    ]
  }
];
