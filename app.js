
// Hero Tracker v0.1.05 - Draggable Character Sheet Panels with mobile support
document.querySelector("h1")?.insertAdjacentHTML("beforeend", " <span style='font-size:0.7em'>(v0.1.05)</span>");

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
  Health: 10, Sanity: 10, Corruption: 0, DarkStone: 0, Gold: 0, XP: 0
};

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
  tab.innerHTML = "<h2>Character Sheet</h2>";

  const layout = [
    createPanel("Base Stats", [
      statDisplay("Agility", 3), statDisplay("Strength", 3), statDisplay("Cunning", 3),
      statDisplay("Spirit", 3), statDisplay("Lore", 3), statDisplay("Luck", 3)
    ]),
    createPanel("Vitals", [
      statAdjuster("Health", "Health"),
      statAdjuster("Sanity", "Sanity"),
      statAdjuster("Grit", "Grit"),
      statDisplay("Defense", 4),
      statDisplay("Willpower", 4)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Combat Rolls", [
      statDisplay("Combat", 4),
      statDisplay("Initiative", 3),
      statDisplay("To-Hit Melee", 7),
      statDisplay("To-Hit Ranged", 6)
    ])
  ];

  layout.forEach(p => tab.appendChild(p));
  enablePanelDrag(tab);
}

function createPanel(title, elements) {
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.setAttribute("draggable", "true");

  const header = document.createElement("h3");
  header.textContent = title;
  header.style.cursor = "grab";
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

document.addEventListener("DOMContentLoaded", () => {
  try {
    document.querySelectorAll(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => showTab(btn.dataset.tab));
    });
    renderSheetTab();
    showTab("sheetTab");
  } catch (err) {
    log("INIT ERROR: " + err.message);
  }
});


function renderGearTab() {
  log("renderGearTab() called");
  const tab = document.getElementById("gearTab");
  tab.innerHTML = "<h3>Equipped Gear</h3>";

  const slots = ["Head", "Torso", "Feet"];
  slots.forEach(slot => {
    const div = document.createElement("div");
    const item = equipped[slot];
    div.innerHTML = `<strong>${slot}</strong>: ${item ? item.name : "None"}`;
    tab.appendChild(div);
  });
}
