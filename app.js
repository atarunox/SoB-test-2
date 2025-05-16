// Hero Tracker v0.1.15 — Cleaned and working with HEROES external

// --- Tab Render Functions --- function renderStatsTab() { const tab = document.getElementById("statsTab"); tab.innerHTML = "Stats TabPlaceholder"; }

function renderGearTab() { const tab = document.getElementById("gearTab"); tab.innerHTML = "Gear TabPlaceholder"; }

function renderConditionsTab() { const tab = document.getElementById("conditionsTab"); tab.innerHTML = "Conditions TabPlaceholder"; }

function renderSkillTree() { const tab = document.getElementById("treeTab"); tab.innerHTML = "Skill Tree TabPlaceholder"; }

function renderSheetTab() { const tab = document.getElementById("sheetTab"); tab.innerHTML = "Character SheetPlaceholder"; }

// --- DOM Ready Logic --- document.addEventListener("DOMContentLoaded", () => { const header = document.querySelector("h1"); if (header && !header.innerHTML.includes("v0.1.15")) { header.innerHTML += " (v0.1.15)"; }

document.querySelectorAll(".tabs button").forEach(btn => { btn.addEventListener("click", () => showTab(btn.dataset.tab)); });

console.log("HEROES.Western =", window.HEROES?.Western); function waitForHeroes(callback, retries = 10) { if (window.HEROES?.Western) { callback(); } else if (retries > 0) { setTimeout(() => waitForHeroes(callback, retries - 1), 100); } else { console.error("HEROES.Western not found"); } }

waitForHeroes(() => { const heroSelect = document.querySelector("#heroSelect"); if (heroSelect) { heroSelect.innerHTML = Object.keys(HEROES.Western) .map(k => <option value="${k}">${k}</option>) .join("");

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
}); }); });

