// Hero Tracker v0.1.15 — Cleaned and working with HEROES external

// --- Tab Render Functions ---
function renderStatsTab() {
const tab = document.getElementById("statsTab");
tab.innerHTML = "Stats TabPlaceholder";
}

function renderGearTab() {
const tab = document.getElementById("gearTab");
tab.innerHTML = "Gear TabPlaceholder";
}

function renderConditionsTab() {
const tab = document.getElementById("conditionsTab");
tab.innerHTML = "Conditions TabPlaceholder";
}

function renderSkillTree() {
const tab = document.getElementById("treeTab");
tab.innerHTML = "Skill Tree TabPlaceholder";
}

function renderSheetTab() {
const tab = document.getElementById("sheetTab");
tab.innerHTML = "Character SheetPlaceholder";
}

// --- DOM Ready Logic ---
document.addEventListener("DOMContentLoaded", () => {
const header = document.querySelector("h1");
if (header && !header.innerHTML.includes("v0.1.15")) {
header.innerHTML += " (v0.1.15)";
}

document.querySelectorAll(".tabs button").forEach(btn => {
btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

  console.log("Dropdown ready:", window.HEROES?.Western);

console.log("HEROES.Western =", window.HEROES?.Western);
const heroSelect = document.querySelector("#heroSelect");
if (heroSelect && window.HEROES?.Western) {
heroSelect.innerHTML = Object.keys(HEROES.Western)
.map(k => <option value="${k}">${k}</option>)
.join("");

heroSelect.addEventListener("change", e => {
  const hero = HEROES.Western[e.target.value];
  if (hero) {
    currentStats.Health = hero.health;
    currentStats.Sanity = hero.sanity;
    currentStats.Grit = hero.maxGrit;
    renderSheetTab();
  }
});

}

renderStatsTab();
renderGearTab();
renderConditionsTab();
renderSkillTree();
renderSheetTab();
showTab("sheetTab");
});
