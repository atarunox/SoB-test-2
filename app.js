// App.js with stat bonuses and source labels for gear and skills

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
  Health: 10, Sanity: 10, Corruption: 0, DarkStone: 0, Gold: 0, XP: 0
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

function calcStatsWithSources() {
  const stats = { ...baseStats };
  const sources = {};

  Object.values(equipped).forEach(item => {
    Object.entries(item.effects).forEach(([stat, val]) => {
      stats[stat] = (stats[stat] ?? 0) + val;
      sources[stat] = (sources[stat] || []);
      sources[stat].push(`${val > 0 ? "+" : ""}${val} from ${item.name}`);
    });
  });

  selectedSkills.forEach(key => {
    const [path, i] = key.split("-");
    const skill = skillTree.find(p => p.path === path)?.skills[+i];
    if (skill?.effects) {
      Object.entries(skill.effects).forEach(([stat, val]) => {
        stats[stat] = (stats[stat] ?? 0) + val;
        sources[stat] = (sources[stat] || []);
        sources[stat].push(`${val > 0 ? "+" : ""}${val} from ${skill.name}`);
      });
    }
  });

  return { stats, sources };
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
  const { stats, sources } = calcStatsWithSources();
  tab.innerHTML = "<h2>Character Sheet</h2>";

  const layout = [
    createPanel("Vitals", [
      statAdjuster("Health", "Health"),
      statAdjuster("Sanity", "Sanity"),
      statDisplay("Defense", stats.Defense, sources.Defense),
      statDisplay("Willpower", stats.Willpower, sources.Willpower)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Combat Rolls", [
      statDisplay("Combat", stats.Combat, sources.Combat),
      statDisplay("Initiative", stats.Initiative, sources.Initiative),
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

function statDisplay(label, value, bonuses) {
  const row = document.createElement("div");
  row.innerHTML = `${label}: <strong>${value}</strong>`;
  if (bonuses && bonuses.length > 0) {
    const bonusList = document.createElement("div");
    bonusList.style.fontSize = "0.8em";
    bonusList.style.color = "#333";
    bonusList.innerHTML = bonuses.map(b => `<div>(${b})</div>`).join("");
    row.appendChild(bonusList);
  }
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
// App.js fixed to restore renderStatsTab with debug and bonus sources

// ... (rest of the code same as before, now restoring renderStatsTab properly)

function renderStatsTab() {
  log("renderStatsTab() called");
  const tab = document.getElementById("statsTab");
  const { stats, sources } = calcStatsWithSources();
  if (tab) {
    tab.innerHTML = "<h3>Stats</h3>";
    Object.keys(stats).forEach(stat => {
      const block = statDisplay(stat, stats[stat], sources[stat]);
      tab.appendChild(block);
    });
  }
}

// Add app version to header
document.querySelector("h1")?.insertAdjacentHTML("beforeend", " <span style='font-size:0.7em'>(v0.9.2)</span>");
