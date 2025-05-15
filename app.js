// Shadows of Brimstone Hero Tracker - Full app.js
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

function renderGearTab() {
  const tab = document.getElementById("gearTab");
  tab.innerHTML = "<h3>Gear</h3>";
  const slots = ["Head", "Shoulders", "Torso", "Coat", "Gloves", "Hands", "Feet", "Pants", "Face", "Extra 1", "Extra 2"];
  slots.forEach(slot => {
    const label = document.createElement("label");
    label.textContent = slot + ": ";
    const select = document.createElement("select");
    select.innerHTML = "<option value=''>None</option>";
    gearList.filter(i => i.slot === slot).forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.name;
      if (equipped[slot]?.id === item.id) opt.selected = true;
      select.appendChild(opt);
    });
    select.onchange = () => {
      if (select.value) equipped[slot] = gearList.find(i => i.id === select.value);
      else delete equipped[slot];
      renderGearTab();
      renderStatsTab();
      renderSheetTab();
    };
    tab.appendChild(label);
    tab.appendChild(select);
    tab.appendChild(document.createElement("br"));
  });
}

function renderConditionsTab() {
  const tab = document.getElementById("conditionsTab");
  tab.innerHTML = "";

  const toggle = document.createElement("label");
  toggle.innerHTML = `<input type="checkbox" ${useHexcrawl ? "checked" : ""}> Use Hexcrawl`;
  toggle.querySelector("input").onchange = () => {
    useHexcrawl = toggle.querySelector("input").checked;
    renderConditionsTab();
  };
  tab.appendChild(toggle);

  Object.entries(conditions).forEach(([type, list]) => {
    const section = document.createElement("div");
    section.innerHTML = `<h3 style="color:${type === "Mutations" ? "green" : type === "Injuries" ? "red" : "blue"}">${type}</h3>`;
    list.forEach((c, i) => {
      const div = document.createElement("div");
      div.textContent = c;
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.onclick = () => {
        if (confirm("Remove condition?")) {
          list.splice(i, 1);
          renderConditionsTab();
          renderSheetTab();
        }
      };
      div.appendChild(btn);
      section.appendChild(div);
    });
    const select = document.createElement("select");
    select.innerHTML = "<option value=''>-- Choose --</option>";
    hexcrawlConditions[type].forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      select.appendChild(opt);
    });
    select.onchange = () => {
      if (select.value) {
        list.push(select.value);
        renderConditionsTab();
        renderSheetTab();
      }
    };
    const roll = document.createElement("button");
    roll.textContent = "Roll";
    roll.onclick = () => {
      const roll = (Math.floor(Math.random() * 6) + 1) * 10 + Math.floor(Math.random() * 6) + 1;
      const result = hexcrawlConditions[type].find(e => e.startsWith(String(roll))) || `Rolled ${roll}: Unknown`;
      list.push(result);
      renderConditionsTab();
      renderSheetTab();
    };
    section.appendChild(select);
    section.appendChild(roll);
    tab.appendChild(section);
  });
}

function createStatAdjuster(label, key) {
  const container = document.createElement("div");
  container.textContent = `${label}: `;
  const minus = document.createElement("button");
  minus.textContent = "-";
  minus.onclick = () => {
    currentStats[key] = Math.max(0, currentStats[key] - 1);
    renderSheetTab();
  };
  const val = document.createElement("span");
  val.textContent = currentStats[key];
  const plus = document.createElement("button");
  plus.textContent = "+";
  plus.onclick = () => {
    currentStats[key]++;
    renderSheetTab();
  };
  container.appendChild(minus);
  container.appendChild(val);
  container.appendChild(plus);
  return container;
}

function renderSheetTab() {
  const tab = document.getElementById("sheetTab");
  const stats = calcStats();
  tab.innerHTML = "<h2>Character Sheet</h2>";

  tab.appendChild(createStatAdjuster("Health", "Health"));
  tab.appendChild(createStatAdjuster("Sanity", "Sanity"));
  tab.appendChild(createStatAdjuster("Grit", "Grit"));
  tab.appendChild(createStatAdjuster("Corruption", "Corruption"));
  tab.appendChild(createStatAdjuster("Dark Stone", "DarkStone"));
  tab.appendChild(createStatAdjuster("Gold", "Gold"));
  tab.appendChild(createStatAdjuster("XP", "XP"));

  const rolls = ["Defense", "Willpower", "Initiative", "Combat", "Agility", "Luck"];
  rolls.forEach(k => {
    const div = document.createElement("div");
    div.textContent = `${k}: ${stats[k] ?? "-"}`;
    tab.appendChild(div);
  });

  const onceSection = document.createElement("div");
  onceSection.innerHTML = "<h3>Once-per-Adventure</h3>";
  oncePerAdventure.forEach(name => {
    const line = document.createElement("div");
    const check = document.createElement("input");
    check.type = "checkbox";
    line.appendChild(check);
    line.appendChild(document.createTextNode(" " + name));
    onceSection.appendChild(line);
  });
  tab.appendChild(onceSection);
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
