// --- Imports --- import { gearList } from './gearList.js';

// --- Global State --- let currentHero = null; let selectedHeroName = ""; let currentStats = {};

// --- Stat Calculation --- function calculateCurrentStats(hero) { const base = { ...hero.stats }; const bonuses = {};

if (hero.gear) { Object.values(hero.gear).forEach(item => { if (item?.effects) { for (const [key, value] of Object.entries(item.effects)) { bonuses[key] = (bonuses[key] || 0) + value; } } }); }

const result = {}; for (const key of Object.keys(base)) { result[key] = base[key] + (bonuses[key] || 0); }

result.Health = hero.health + (bonuses.Health || 0); result.Sanity = hero.sanity + (bonuses.Sanity || 0); result.Grit = hero.maxGrit + (bonuses.Grit || 0); result.Initiative = base.Initiative + (bonuses.Initiative || 0); result.Defense = hero.defense; result.Willpower = hero.willpower;

return result; }

// --- Tab Rendering --- function renderStatsTab() { const tab = document.getElementById("statsTab"); tab.innerHTML = <h2>Stats</h2> <ul> <li>Health: ${currentStats.Health}</li> <li>Sanity: ${currentStats.Sanity}</li> <li>Grit: ${currentStats.Grit}</li> </ul>; }

function renderGearTab() { const tab = document.getElementById("gearTab"); if (!currentHero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

currentHero.gear = currentHero.gear ?? {}; currentHero.inventory = currentHero.inventory ?? []; const gearSlots = ["Head", "Torso", "Coat", "Gloves", "Hands", "Pants", "Feet", "Shoulders", "Face", "Extra 1", "Extra 2"];

tab.innerHTML = <h2>Equipped Gear</h2> <div class="gear-grid"> ${gearSlots.map(slot => { const equipped = currentHero.gear[slot]; const gearName = equipped ? equipped.name : "—"; return <div class="gear-slot"> <label><strong>${slot}</strong></label> <div>${gearName}</div> <select onchange="equipGear('${slot}', this.value)"> <option value="" ${!equipped ? "selected" : ""}>(Empty)</option> ${currentHero.inventory .filter(g => g.slot === slot) .map(g => <option value="${g.id}" ${equipped?.id === g.id ? "selected" : ""}>${g.name}</option>) .join("")} </select> </div> `; }).join("")} </div>

<h2>Inventory</h2>
<ul>
  ${currentHero.inventory.length === 0
    ? "<li>(Empty)</li>"
    : currentHero.inventory.map(g => `<li>${g.name}</li>`).join("")}
</ul>

`; }

window.equipGear = function (slot, gearId) { if (gearId === "") { if (currentHero.gear[slot]) { currentHero.inventory.push(currentHero.gear[slot]); delete currentHero.gear[slot]; } } else { const gear = gearList.find(g => g.id === gearId); if (!gear) return;

currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
if (currentHero.gear[slot]) currentHero.inventory.push(currentHero.gear[slot]);
currentHero.gear[slot] = gear;

}

currentStats = calculateCurrentStats(currentHero); renderGearTab(); renderStatsTab(); renderSheetTab(); };

function renderSheetTab() { const tab = document.getElementById("sheetTab"); const hero = currentHero; if (!hero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

hero.currHealth = hero.currHealth ?? hero.health; hero.currSanity = hero.currSanity ?? hero.sanity;

const statBlocks = [ { label: "Health", value: ${hero.currHealth}/${hero.health} }, { label: "Sanity", value: ${hero.currSanity}/${hero.sanity} }, { label: "Defense", value: hero.defense }, { label: "Willpower", value: hero.willpower }, { label: "Initiative", value: currentStats.Initiative }, { label: "Grit", value: currentStats.Grit }, { label: "Corruption", value: ${hero.corruption ?? 0}+ } ];

tab.innerHTML = <div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()"> ${statBlocks.map(stat => renderDraggableSection(stat.label, <div class='tile-content'> <p class='label'>${stat.label}</p> <div class='tile-value'>${stat.value}</div> </div> )).join("")} </div> ; }

function renderDraggableSection(title, content) { return <div class="tile stat-tile" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.id)" id="section-${title.replace(/\s+/g, '')}" ondrop="const fromId = event.dataTransfer.getData('text/plain'); const fromEl = document.getElementById(fromId); this.parentNode.insertBefore(fromEl, this);"> <div class="tile-header">${title}</div> ${content} </div>; }

// --- Tab Switching --- function showTab(tabName) { document.querySelectorAll(".tab-content").forEach(el => { el.style.display = el.id === tabName ? "block" : "none"; }); }

// --- Initialization --- document.addEventListener("DOMContentLoaded", () => { const header = document.querySelector("h1"); if (header && !header.innerHTML.includes("v0.1.15")) { header.innerHTML += " (v0.1.15)"; }

document.querySelectorAll(".tabs button").forEach(btn => { btn.addEventListener("click", () => showTab(btn.dataset.tab)); });

function waitForHeroes(callback, retries = 10) { if (window.HEROES?.Western) { callback(); } else if (retries > 0) { setTimeout(() => waitForHeroes(callback, retries - 1), 100); } else { console.error("HEROES.Western not found"); } }

waitForHeroes(() => { const heroSelect = document.querySelector("#heroSelect"); if (heroSelect) { heroSelect.innerHTML = Object.keys(HEROES.Western) .map(k => <option value="${k}">${k}</option>) .join("");

heroSelect.addEventListener("change", e => {
    const heroName = e.target.value;
    const hero = HEROES.Western[heroName];
    if (hero) {
      selectedHeroName = heroName;
      currentHero = hero;
      hero.inventory = gearList.filter(g => g.id.startsWith("test_"));
      currentStats = calculateCurrentStats(hero);
      renderStatsTab();
      renderSheetTab();
      renderGearTab();
      showTab("sheetTab");
    }
  });
}

renderStatsTab();
renderGearTab();
renderSheetTab();
showTab("sheetTab");

}); });

