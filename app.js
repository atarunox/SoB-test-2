
// Hero Tracker v0.1.12 â€” Clean rebuild with Gear + Character Sheet + working version

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
  tab.innerHTML = "<h3>Equipped Gear</h3><p style='color:green;'>Select gear for each slot</p>";

  const slots = ["Head", "Torso", "Shoulders", "Coat", "Gloves", "Hands", "Feet", "Pants", "Face", "Extra 1", "Extra 2"];
  window.equipped = window.equipped || {
    "Head": { id: "hat", name: "Sturdy Hat", slot: "Head" },
    "Torso": { id: "vest", name: "Leather Vest", slot: "Torso" },
    "Feet": { id: "boots", name: "Swift Boots", slot: "Feet" }
  };

  const inventory = [
    { id: "none", name: "None", slot: "Any" },
    { id: "hat", name: "Sturdy Hat", slot: "Head" },
    { id: "vest", name: "Leather Vest", slot: "Torso" },
    { id: "shoulders", name: "Spiked Shoulders", slot: "Shoulders" },
    { id: "coat", name: "Duster Coat", slot: "Coat" },
    { id: "gloves", name: "Brass Knuckles", slot: "Gloves" },
    { id: "boots", name: "Swift Boots", slot: "Feet" }
  ];

  slots.forEach(slot => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = slot + ": ";
    const select = document.createElement("select");

    const options = inventory.filter(i => i.slot === slot || i.slot === "Any");
    options.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.name;
      if (window.equipped[slot]?.id === item.id) opt.selected = true;
      select.appendChild(opt);
    });

    select.onchange = () => {
      const item = inventory.find(i => i.id === select.value);
      window.equipped[slot] = item.id === "none" ? null : item;
      renderGearTab(); // re-render to reflect changes
    };

    div.appendChild(label);
    div.appendChild(select);
    tab.appendChild(div);
  });
}
  ];

  const equipped = window.equipped = window.equipped || {};

  slots.forEach(slot => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = slot + ": ";
    const select = document.createElement("select");

    // Populate dropdown
    inventory
      .filter(i => i.slot === slot || i.slot === "Any")
      .forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.name;
        if (equipped[slot]?.id === item.id) opt.selected = true;
        select.appendChild(opt);
      });

    select.onchange = () => {
      const selected = inventory.find(i => i.id === select.value);
      equipped[slot] = selected?.id === "nothing" ? null : selected;
      renderGearTab();
    };

    div.appendChild(label);
    div.appendChild(select);
    tab.appendChild(div);
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
      statDisplay("Defense", 4),
      statDisplay("Willpower", 4)
    ]),
    createPanel("Resources", [
      statAdjuster("Dark Stone", "DarkStone"),
      statAdjuster("Gold", "Gold"),
      statAdjuster("XP", "XP"),
      statAdjuster("Corruption", "Corruption")
    ]),
    createPanel("Base Stats", [
      statDisplay("Agility", 3), statDisplay("Strength", 3), statDisplay("Cunning", 3),
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
