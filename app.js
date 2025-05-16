// SoB Tracker app.js with Character Sheet panel layout (grouped and draggable in layout)

import { gearList } from './gear.js';
import { skillTree } from './skills.js';
import { hexcrawlConditions } from './conditions.js';

let equipped = {};
let selectedSkills = [];
let useHexcrawl = true;
let conditions = { Mutations: [], Injuries: [], Madness: [] };
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
let oncePerAdventure = [];

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
      if (skill.desc?.toLowerCase().includes("once per adventure")) {
        if (!oncePerAdventure.includes(skill.name)) oncePerAdventure.push(skill.name);
      }
    }
  });
  return stats;
}

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const tab = document.getElementById(id);
  if (tab) tab.style.display = 'block';
}

function renderStatsTab() {
  const tab = document.getElementById("statsTab");
  tab.innerHTML = "<h3>Stats</h3>";
  const stats = calcStats();
  Object.entries(stats).forEach(([k, v]) => {
    const div = document.createElement("div");
    div.textContent = `${k}: ${v}`;
    tab.appendChild(div);
  });
}

function renderSheetTab() {
  const tab = document.getElementById("sheetTab");
  const stats = calcStats();
  tab.innerHTML = "<h2>Character Sheet</h2>";

  const panelOrder = [
    { id: "vitals", title: "Vitals", content: renderVitals },
    { id: "resources", title: "Resources", content: renderResources },
    { id: "combat", title: "Combat Rolls", content: renderCombatRolls },
    { id: "abilities", title: "Once per Adventure", content: renderOnceAbilities },
    { id: "conditions", title: "Conditions", content: renderConditionsSummary }
  ];

  panelOrder.forEach(({ id, title, content }) => {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("draggable", "true");
    panel.dataset.panel = id;

    const header = document.createElement("h3");
    header.textContent = title;
    panel.appendChild(header);

    const body = content(stats);
    if (Array.isArray(body)) body.forEach(el => panel.appendChild(el));
    else if (body) panel.appendChild(body);

    tab.appendChild(panel);
  });

  enablePanelDrag(document.getElementById("sheetTab"));
}

function renderVitals(stats) {
  return [
    statAdjuster("Health", "Health"),
    statAdjuster("Sanity", "Sanity"),
    statDisplay("Defense", stats.Defense),
    statDisplay("Willpower", stats.Willpower)
  ];
}

function renderResources() {
  return [
    statAdjuster("Dark Stone", "DarkStone"),
    statAdjuster("Gold", "Gold"),
    statAdjuster("XP", "XP"),
    statAdjuster("Corruption", "Corruption")
  ];
}

function renderCombatRolls(stats) {
  return [
    statDisplay("Combat", stats.Combat),
    statDisplay("Initiative", stats.Initiative),
    statDisplay("To-Hit Melee", stats.Combat + 3),
    statDisplay("To-Hit Ranged", stats.Cunning + 3)
  ];
}

function renderOnceAbilities() {
  return oncePerAdventure.map(name => {
    const line = document.createElement("div");
    const check = document.createElement("input");
    check.type = "checkbox";
    line.appendChild(check);
    line.appendChild(document.createTextNode(" " + name));
    return line;
  });
}

function renderConditionsSummary() {
  return Object.entries(conditions).flatMap(([type, list]) => {
    return list.map(entry => {
      const div = document.createElement("div");
      div.textContent = `${type}: ${entry}`;
      return div;
    });
  });
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
      const panels = Array.from(container.querySelectorAll(".panel"));
      const after = panels.find(p => e.clientY < p.getBoundingClientRect().top + p.offsetHeight / 2 && p !== dragSrc);
      if (after) container.insertBefore(dragSrc, after);
    });

    panel.addEventListener("dragend", () => {
      dragSrc.classList.remove("dragging");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  renderStatsTab();
  renderGearTab();
  renderConditionsTab();
  renderSheetTab();
  showTab("statsTab");
});
