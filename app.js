
const HEROES = {
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
};



let equipped = {
  "Head": { name: "Sturdy Hat", effects: { Defense: 1 } },
  "Torso": { name: "Leather Vest", effects: { Defense: 1 } },
  "Feet": { name: "Swift Boots", effects: { Agility: 1 } }
};

function calcStats() {
  const stats = {
    Agility: 3, Strength: 3, Cunning: 3, Spirit: 3, Lore: 3, Luck: 3,
    Initiative: 3, Combat: 3, Defense: 3, Willpower: 3
  };
  for (const slot in equipped) {
    const item = equipped[slot];
    if (item?.effects) {
      for (const stat in item.effects) {
        stats[stat] = (stats[stat] || 0) + item.effects[stat];
      }
    }
  }
  return stats;
}



// Hero Tracker v0.1.12 â€” Restored working build with Gear + Character Sheet

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("h1");
  if (header && !header.innerHTML.includes("v0.1.12")) {
    header.innerHTML += " <span style='font-size:0.7em'>(v0.1.12)</span>";
  }

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  renderStatsTab();
  renderGearTab();
  renderConditionsTab();
  renderSkillTree();
  renderSheetTab();
  showTab("sheetTab");
  document.querySelector("#heroSelect").addEventListener("change", e => {
  const hero = HEROES[e.target.value];
  if (!hero) return;

  currentStats.Health = hero.health;
  currentStats.Sanity = hero.sanity;
  currentStats.Grit = hero.maxGrit;
});
});

function log(msg) {
  const logArea = document.getElementById("debugLog") || (() => {
    const box = document.createElement("div");
    box.id = "debugLog";
    box.style.position = "fixed";
    box.style.bottom = "0";
    box.style.left = "0";
    box.style.right = "0";
    box.style.maxHeight = "200px";
    box.style.overflowY = "auto";
    box.style.background = "black";
    box.style.color = "lime";
    box.style.fontSize = "12px";
    box.style.padding = "4px";
    document.body.appendChild(box);
    return box;
  })();
  const line = document.createElement("div");
  line.textContent = msg;
  logArea.appendChild(line);
}

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    if (id === "statsTab") renderStatsTab();
    else if (id === "gearTab") renderGearTab();
    else if (id === "conditionsTab") renderConditionsTab();
    else if (id === "treeTab") renderSkillTree();
    else if (id === "sheetTab") renderSheetTab();
    log("Switched to tab: " + id);
  }
}

function renderStatsTab() {
  const tab = document.getElementById("statsTab");
  tab.innerHTML = "<h3>Stats Tab</h3><p>Placeholder</p>";
}

function renderGearTab() {
  log("renderGearTab() called");
  const tab = document.getElementById("gearTab");
  tab.innerHTML = "<h3>Equipped Gear</h3>";

  const slots = ["Head", "Torso", "Shoulders", "Coat", "Gloves", "Hands", "Feet", "Pants", "Face", "Extra 1", "Extra 2"];
  const equipped = {
    "Head": { name: "Sturdy Hat" },
    "Torso": { name: "Leather Vest" },
    "Shoulders": { name: "Spiked Shoulders" },
    "Coat": { name: "Duster Coat" },
    "Gloves": { name: "Brass Knuckles" },
    "Feet": { name: "Swift Boots" }
  };

  slots.forEach(slot => {
    const div = document.createElement("div");
    const item = equipped[slot];
    div.innerHTML = "<strong>" + slot + "</strong>: " + (item ? item.name : "None");
    tab.appendChild(div);
  });

  // Backpack section
  const backpack = [
    "Torch", "Pickaxe", "Bandages", "Lantern Oil", "Lucky Coin"
  ];
  const packHeader = document.createElement("h3");
  packHeader.textContent = "Backpack";
  tab.appendChild(packHeader);
  backpack.forEach(item => {
    const line = document.createElement("div");
    line.textContent = item;
    tab.appendChild(line);
  });

  // Side Bag section
  const sideBag = [
    "Whiskey", "Dynamite", "Bandages", "Herbs"
  ];
  const sideHeader = document.createElement("h3");
  sideHeader.textContent = "Side Bag";
  tab.appendChild(sideHeader);
  sideBag.forEach(token => {
    const line = document.createElement("div");
    line.textContent = token;
    tab.appendChild(line);
  });
}
  };
  slots.forEach(slot => {
    const div = document.createElement("div");
    const item = equipped[slot];
    div.innerHTML = `<strong>${slot}</strong>: ${item ? item.name : "None"}`;
    tab.appendChild(div);
  });
}

function renderConditionsTab() {
  const tab = document.getElementById("conditionsTab");
  tab.innerHTML = "<h3>Conditions Tab</h3><p>Placeholder</p>";
}

function renderSkillTree() {
  const tab = document.getElementById("treeTab");
  tab.innerHTML = "<h3>Skill Tree Tab</h3><p>Placeholder</p>";
}

let currentStats = {
  Health: 10, Sanity: 10, Grit: 1, Corruption: 0, DarkStone: 0, Gold: 0, XP: 0
};

function renderSheetTab() {
  const tab = document.getElementById("sheetTab");
  tab.innerHTML = "<h2>Character Sheet</h2>";
  const layout = [
    createPanel("Vitals", [
      statAdjuster("Health", "Health"),
      statAdjuster("Sanity", "Sanity"),
      statAdjuster("Grit", "Grit"),
      statDisplay("Defense", calcStats().Defense),
      statDisplay("Willpower", calcStats().Willpower)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Base Stats", [
      statDisplay("Agility", calcStats().Agility), statDisplay("Strength", 3), statDisplay("Cunning", 3),
      statDisplay("Spirit", 3), statDisplay("Lore", 3), statDisplay("Luck", 3)
    ]),
    createPanel("Combat Rolls", [
      statDisplay("Combat", 4), statDisplay("Initiative", 3),
      statDisplay("To-Hit Melee", 7), statDisplay("To-Hit Ranged", 6)
    ])
  ];
  layout.forEach(p => tab.appendChild(p));
  enablePanelDrag(tab);
}

function createPanel(title, elements) {
  const panel = document.createElement("div");
  panel.className = "panel";
  const header = document.createElement("h3");
  header.textContent = title;
  header.style.cursor = "grab";
  panel.setAttribute("draggable", "true");
  panel.appendChild(header);
  elements.forEach(el => panel.appendChild(el));
  return panel;
}

function statAdjuster(label, key) {
  const row = document.createElement("div");
  const minus = document.createElement("button");
  minus.textContent = "-";
  minus.onclick = () => { currentStats[key] = Math.max(0, currentStats[key] - 1); renderSheetTab(); };
  const val = document.createElement("span");
  val.textContent = currentStats[key];
  val.style.margin = "0 8px";
  const plus = document.createElement("button");
  plus.textContent = "+";
  plus.onclick = () => { currentStats[key]++; renderSheetTab(); };
  row.textContent = `${label}: `;
  row.appendChild(minus);
  row.appendChild(val);
  row.appendChild(plus);
  return row;
}

function statDisplay(label, value) {
  const row = document.createElement("div");
  row.textContent = `${label}: ${value ?? "-"}`;
  return row;
}

function enablePanelDrag(container) {
  let dragSrc = null;
  container.querySelectorAll(".panel").forEach(panel => {
    panel.addEventListener("dragstart", e => {
      dragSrc = panel;
      panel.classList.add("dragging");
    });
    panel.addEventListener("dragover", e => {
      e.preventDefault();
      const panels = Array.from(container.querySelectorAll(".panel")).filter(p => p !== dragSrc);
      const after = panels.find(p => e.clientY < p.getBoundingClientRect().top + p.offsetHeight / 2);
      if (after) container.insertBefore(dragSrc, after);
      else container.appendChild(dragSrc);
    });
    panel.addEventListener("dragend", () => {
      panel.classList.remove("dragging");
    });
  });
}
