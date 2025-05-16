// SoB Tracker with gear + skill stat modifiers in calcStats()

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

let baseStats = {
  Agility: 3, Strength: 3, Cunning: 3, Spirit: 3, Lore: 3, Luck: 3,
  Initiative: 3, Combat: 3, Grit: 1, Willpower: 3, Defense: 3,
  Health: 10, Sanity: 10
};

let currentStats = {
  Health: 10,
  Sanity: 10,
  Corruption: 0,
  DarkStone: 0,
  Gold: 0,
  XP: 0
};

const gearList = [
  { id: "vest", name: "Leather Vest", slot: "Torso", effects: { Defense: 1 } },
  { id: "boots", name: "Swift Boots", slot: "Feet", effects: { Agility: 1 } }
];
const equipped = {
  Torso: gearList[0],
  Feet: gearList[1]
};

const skillTree = [
  {
    path: "Gladiator",
    skills: [
      { name: "Brawlerâ€™s Strength", effects: { Combat: 1 } },
      { name: "Battle Focus", effects: { Willpower: 1 } }
    ]
  }
];
const selectedSkills = ["Gladiator-0", "Gladiator-1"];

function calcStats() {
  const stats = { ...baseStats };
  Object.values(equipped).forEach(item => {
    Object.entries(item.effects).forEach(([stat, val]) => {
      if (stats[stat] != null) stats[stat] += val;
    });
  });
  selectedSkills.forEach(key => {
    const [path, i] = key.split("-");
    const skill = skillTree.find(p => p.path === path)?.skills[+i];
    if (skill?.effects) {
      Object.entries(skill.effects).forEach(([stat, val]) => {
        if (stats[stat] != null) stats[stat] += val;
      });
    }
  });
  return stats;
}

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    log("Switched to tab: " + id);
  }
}

function renderSheetTab() {
  log("renderSheetTab() called");
  const tab = document.getElementById("sheetTab");
  const stats = calcStats();
  tab.innerHTML = "<h2>Character Sheet</h2>";

  const layout = [
    createPanel("Vitals", [
      statAdjuster("Health", "Health"),
      statAdjuster("Sanity", "Sanity"),
      statDisplay("Defense", stats.Defense),
      statDisplay("Willpower", stats.Willpower)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Combat Rolls", [
      statDisplay("Combat", stats.Combat),
      statDisplay("Initiative", stats.Initiative),
      statDisplay("To-Hit Melee", stats.Combat + 3),
      statDisplay("To-Hit Ranged", stats.Cunning + 3)
    ])
  ];

  layout.forEach(p => tab.appendChild(p));
}

function createPanel(title, elements) {
  const panel = document.createElement("div");
  panel.className = "panel";
  const header = document.createElement("h3");
  header.textContent = title;
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

document.addEventListener("DOMContentLoaded", () => {
  try {
    document.querySelectorAll(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => showTab(btn.dataset.tab));
    });
    renderStatsTab = () => log("Stats not implemented");
    renderGearTab = () => log("Gear not implemented");
    renderConditionsTab = () => log("Conditions not implemented");
    renderSkillTree = () => log("Skill tree not implemented");

    renderStatsTab();
    renderGearTab();
    renderConditionsTab();
    renderSkillTree();
    renderSheetTab();
    showTab("statsTab");
  } catch (err) {
    log("INIT ERROR: " + err.message);
  }
});
