// Debugged Character Sheet app.js with panels and logging

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

let currentStats = {
  Health: 10,
  Sanity: 10,
  Corruption: 0,
  DarkStone: 0,
  Gold: 0,
  XP: 0
};

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    log("Switched to tab: " + id);
  }
}

function renderStatsTab() {
  log("renderStatsTab() called");
  const tab = document.getElementById("statsTab");
  if (tab) tab.innerHTML = "<h3>Stats Tab Loaded</h3>";
}

function renderGearTab() {
  log("renderGearTab() called");
  const tab = document.getElementById("gearTab");
  if (tab) tab.innerHTML = "<h3>Gear Tab Loaded</h3>";
}

function renderConditionsTab() {
  log("renderConditionsTab() called");
  const tab = document.getElementById("conditionsTab");
  if (tab) tab.innerHTML = "<h3>Conditions Tab Loaded</h3>";
}

function renderSkillTree() {
  log("renderSkillTree() called");
  const tab = document.getElementById("treeTab");
  if (tab) tab.innerHTML = "<h3>Skill Tree Loaded</h3>";
}

function renderSheetTab() {
  log("renderSheetTab() called");
  const tab = document.getElementById("sheetTab");
  tab.innerHTML = "<h2>Character Sheet</h2>";

  const layout = [
    createPanel("Vitals", [
      statAdjuster("Health", "Health"),
      statAdjuster("Sanity", "Sanity"),
      statDisplay("Defense", 3),
      statDisplay("Willpower", 3)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Combat Rolls", [
      statDisplay("Combat", 3),
      statDisplay("Initiative", 3),
      statDisplay("To-Hit Melee", 6),
      statDisplay("To-Hit Ranged", 6)
    ]),
    createPanel("Once per Adventure", [
      checkboxLine("Recover Grit"),
      checkboxLine("Use Healing Herb")
    ]),
    createPanel("Conditions", [
      statDisplay("Mutation", "None"),
      statDisplay("Injury", "None"),
      statDisplay("Madness", "None")
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

function checkboxLine(label) {
  const line = document.createElement("div");
  const check = document.createElement("input");
  check.type = "checkbox";
  line.appendChild(check);
  line.appendChild(document.createTextNode(" " + label));
  return line;
}

window.addEventListener("error", function(e) {
  log("JS ERROR: " + e.message + " at " + e.filename + ":" + e.lineno);
});

document.addEventListener("DOMContentLoaded", () => {
  try {
    document.querySelectorAll(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => showTab(btn.dataset.tab));
    });
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
