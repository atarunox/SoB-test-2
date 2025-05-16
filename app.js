// --- Imports --- import { gearList } from './gearList.js';

// --- Global State --- let currentHero = null; let selectedHeroName = ""; let currentStats = {};

function calculateCurrentStats(hero) { const base = { ...hero.stats }; const bonuses = {};

if (hero.gear) { Object.values(hero.gear).forEach(item => { if (item?.effects) { for (const [key, value] of Object.entries(item.effects)) { bonuses[key] = (bonuses[key] || 0) + value; } } }); }

const result = {}; for (const key of Object.keys(base)) { result[key] = base[key] + (bonuses[key] || 0); }

result.Health = hero.health + (bonuses.Health || 0); result.Sanity = hero.sanity + (bonuses.Sanity || 0); result.Grit = hero.maxGrit + (bonuses.Grit || 0); result.Initiative = result.Initiative || hero.stats.Initiative; result.Defense = hero.defense; result.Willpower = hero.willpower;

return result; }

// --- Render Functions --- function renderStatsTab() { const tab = document.getElementById("statsTab"); tab.innerHTML = <h2>Stats</h2> <ul> <li>Health: ${currentStats.Health}</li> <li>Sanity: ${currentStats.Sanity}</li> <li>Grit: ${currentStats.Grit}</li> </ul>; }

function renderGearTab() { const tab = document.getElementById("gearTab"); if (!currentHero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

currentHero.gear = currentHero.gear ?? {}; currentHero.inventory = currentHero.inventory ?? []; const gearSlots = ["Head", "Torso", "Coat", "Gloves", "Hands", "Pants", "Feet", "Shoulders", "Face", "Extra 1", "Extra 2"];

tab.innerHTML = ` <div class="quick-stats"> <div class="quick-tile"><div class="label">Grit</div><div class="value">${currentStats.Grit}</div></div> <div class="quick-tile"><div class="label">Initiative</div><div class="value">${currentStats.Initiative}</div></div> <div class="quick-tile"><div class="label">Corruption</div><div class="value">${currentHero.corruption ?? 0}+</div></div> </div>

<h2>Equipped Gear</h2>
<div class="gear-grid">
  ${gearSlots.map(slot => {
    const equipped = currentHero.gear[slot];
    const gearName = equipped ? equipped.name : "—";
    return `
      <div class="gear-slot">
        <label><strong>${slot}</strong></label>
        <div>${gearName}</div>
        <select onchange="equipGear('${slot}', this.value)">
          <option value="" ${!equipped ? "selected" : ""}>(Empty)</option>
          ${currentHero.inventory.filter(g => g.slot === slot).map(g => `<option value="${g.id}" ${equipped?.id === g.id ? "selected" : ""}>${g.name}</option>`).join("")}
        </select>
      </div>
    `;
  }).join("")}
</div>

<h2>Inventory</h2>
<ul>
  ${currentHero.inventory.length === 0 ? "<li>(Empty)</li>" : currentHero.inventory.map(g => `<li>${g.name}</li>`).join("")}
</ul>

`; }

window.equipGear = function (slot, gearId) { if (gearId === "") { if (currentHero.gear[slot]) { currentHero.inventory.push(currentHero.gear[slot]); delete currentHero.gear[slot]; } } else { const gear = gearList.find(g => g.id === gearId); if (!gear) return;

currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
if (currentHero.gear[slot]) currentHero.inventory.push(currentHero.gear[slot]);
currentHero.gear[slot] = gear;

}

currentStats = calculateCurrentStats(currentHero); renderGearTab(); renderStatsTab(); };

function renderSheetTab() { const tab = document.getElementById("sheetTab"); const hero = currentHero; if (!hero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

tab.innerHTML = <div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()"> ${renderDraggableSection("Vitals", <div class='tile-content vitals-group'> <div class="vital-pair"> <div class="vital-box"> <div class="tile-header">Health</div> <p><strong>${hero.currHealth ?? hero.health}/${hero.health}</strong></p> <div class="tile-header">Defense</div> <p><strong>${hero.defense}</strong></p> </div> <div class="vital-box"> <div class="tile-header">Sanity</div> <p><strong>${hero

