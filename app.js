// app.js import { gearList } from './gearList.js';

let currentHero = null; let selectedHeroName = ""; let currentStats = {};

function calculateCurrentStats(hero) { const base = { ...hero.stats }; const bonuses = {};

if (hero.gear) { Object.values(hero.gear).forEach(item => { if (item?.effects) { for (const [key, value] of Object.entries(item.effects)) { bonuses[key] = (bonuses[key] || 0) + value; } } }); }

const result = {}; for (const key of Object.keys(base)) { result[key] = base[key] + (bonuses[key] || 0); }

result.Health = hero.health + (bonuses.Health || 0); result.Sanity = hero.sanity + (bonuses.Sanity || 0); result.Grit = hero.maxGrit + (bonuses.Grit || 0); result.Initiative = result.Initiative || hero.stats.Initiative; result.Defense = hero.defense; result.Willpower = hero.willpower;

return result; }

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

currentStats = calculateCurrentStats(currentHero); renderGearTab(); renderSheetTab(); };

function renderSheetTab() { const tab = document.getElementById("sheetTab"); const hero = currentHero; if (!hero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

const statTiles = ["Health", "Sanity", "Defense", "Willpower", "Initiative", "Grit", "Corruption"];

tab.innerHTML = <div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()"> ${statTiles.map(stat => { let value = stat === "Corruption" ?${hero.corruption ?? 0}+:<span class="stat-breakdown" data-stat="${stat}">${currentStats[stat] ?? "—"}</span>; return renderDraggableSection(stat, <div class='tile-content'><p><strong>${value}</strong></p></div>); }).join("")} </div> ;

hero.currHealth = hero.currHealth ?? hero.health; hero.currSanity = hero.currSanity ?? hero.sanity;

setupStatBreakdownListeners(); }

function renderDraggableSection(title, content) { return <div class="tile stat-tile" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.id)" id="section-${title.replace(/\s+/g, '')}" ondrop="const fromId = event.dataTransfer.getData('text/plain'); const fromEl = document.getElementById(fromId); this.parentNode.insertBefore(fromEl, this);"> <div class="tile-header">${title}</div> ${content} </div>; }

function showTab(tabName) { document.querySelectorAll(".tab-content").forEach(el => { el.style.display = el.id === tabName ? "block" : "none"; }); }

function setupStatBreakdownListeners() { let pressTimer = null;

document.querySelectorAll('.stat-breakdown').forEach(el => { const stat = el.dataset.stat; const showBreakdown = () => { const base = currentHero.stats?.[stat] ?? 0; const gearBonus = Object.values(currentHero.gear || {}).reduce((sum, item) => sum + (item?.effects?.[stat] || 0), 0); const total = base + gearBonus; alert(${stat} = ${base} (base) + ${gearBonus} (gear)\nTotal: ${total}); };

el.addEventListener('mousedown', e => {
  e.preventDefault();
  pressTimer = setTimeout(showBreakdown, 600);
});
el.addEventListener('mouseup', () => clearTimeout(pressTimer));
el.addEventListener('mouseleave', () => clearTimeout(pressTimer));

el.addEventListener('touchstart', e => {
  pressTimer = setTimeout(showBreakdown, 600);
});
el.addEventListener('touchend', () => clearTimeout(pressTimer));

}); }

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

      renderSheetTab();
      renderGearTab();
      showTab("sheetTab");
    }
  });
}

renderSheetTab();
renderGearTab();
showTab("sheetTab");

}); });

