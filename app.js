import { gearList } from './gearList.js';

// --- Tab Render Functions --- let currentHero = null; let selectedHeroName = ""; let currentStats = {}; // <-- optional if still used

function calculateCurrentStats(hero) { const base = { ...hero.stats }; const bonuses = {};

if (hero.gear) { Object.values(hero.gear).forEach(item => { if (item?.effects) { for (const [key, value] of Object.entries(item.effects)) { bonuses[key] = (bonuses[key] || 0) + value; } } }); }

const result = {}; for (const key of Object.keys(base)) { result[key] = base[key] + (bonuses[key] || 0); }

result.Health = hero.health + (bonuses.Health || 0); result.Sanity = hero.sanity + (bonuses.Sanity || 0); result.Grit = hero.maxGrit + (bonuses.Grit || 0); result.Defense = hero.defense; // Not numeric — don’t apply math result.Willpower = hero.willpower; result.Initiative = result.Initiative ?? hero.stats?.Initiative ?? 0;

return result; }

function renderStatsTab() { const tab = document.getElementById("statsTab"); tab.innerHTML = <h2>Stats</h2> <ul> <li>Health: ${currentStats.Health}</li> <li>Sanity: ${currentStats.Sanity}</li> <li>Grit: ${currentStats.Grit}</li> </ul>; }

function renderGearTab() { const tab = document.getElementById("gearTab"); if (!currentHero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

currentHero.gear = currentHero.gear ?? {}; currentHero.inventory = currentHero.inventory ?? [];

const gearSlots = ["Head", "Torso", "Coat", "Gloves", "Hands", "Pants", "Feet", "Shoulders", "Face", "Extra 1", "Extra 2"];

tab.innerHTML = <h2>Equipped Gear</h2> <div class="gear-grid"> ${gearSlots.map(slot => { const equipped = currentHero.gear[slot]; const gearName = equipped ? equipped.name : "—"; return <div class="gear-slot"> <label><strong>${slot}</strong></label> <div>${gearName}</div> <select onchange="equipGear('${slot}', this.value)"> <option value="" ${!equipped ? "selected" : ""}>(Empty)</option> ${currentHero.inventory .filter(g => g.slot === slot) .map(g => <option value="${g.id}" ${equipped?.id === g.id ? "selected" : ""}>${g.name}</option>) .join("")} </select> </div> `; }).join("")} </div>

<h2>Inventory</h2>
<ul>
  ${currentHero.inventory.length === 0 ? "<li>(Empty)</li>" : currentHero.inventory.map(g => `<li>${g.name}</li>`).join("")}
</ul>

`; }

window.equipGear = function (slot, gearId) { if (gearId === "") { if (currentHero.gear[slot]) { currentHero.inventory.push(currentHero.gear[slot]); delete currentHero.gear[slot]; } } else { const gear = gearList.find(g => g.id === gearId); if (!gear) return;

currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
if (currentHero.gear[slot]) {
  currentHero.inventory.push(currentHero.gear[slot]);
}
currentHero.gear[slot] = gear;

}

currentStats = calculateCurrentStats(currentHero); renderGearTab(); renderStatsTab(); };

function renderConditionsTab() { document.getElementById("conditionsTab").innerHTML = "Conditions TabPlaceholder"; }

function renderSkillTree() { document.getElementById("treeTab").innerHTML = "Skill Tree TabPlaceholder"; }

function showTab(tabName) { document.querySelectorAll(".tab-content").forEach(el => { el.style.display = el.id === tabName ? "block" : "none"; }); }

function renderSheetTab() { const tab = document.getElementById("sheetTab"); const hero = currentHero; if (!hero) { tab.innerHTML = "<p>No hero selected.</p>"; return; }

tab.innerHTML = ` <div class="quick-stats"> <div class="quick-tile"> <div class="label">Grit</div> <div class="value">${currentStats.Grit}</div> </div> <div class="quick-tile"> <div class="label">Initiative</div> <div class="value">${currentStats.Initiative}</div> </div> <div class="quick-tile"> <div class="label">Corruption</div> <div class="value">${currentHero.corruption ?? 0}+</div> </div> </div>

<div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()">
  ${renderDraggableSection("Vitals", `
    <div class='tile-content stats-grid'>
      <p>Health <span>${hero.currHealth ?? hero.health}/${hero.health}</span></p>
      <p>Sanity <span>${hero.currSanity ?? hero.sanity}/${hero.sanity}</span></p>
      <p>Grit <span>${hero.maxGrit}/${hero.maxGrit}</span></p>
      <p>Willpower <span>${hero.willpower}</span></p>
      <p>Defense <span>${hero.defense}</span></p>
    </div>
  `)}

  ${renderDraggableSection("Stats", `
    <div class='tile-content stats-grid'>
      ${Object.entries(hero.stats).map(([key, val]) => `<p>${key} <span>${val}</span></p>`).join("")}
      <p>Corruption <span>${hero.corruption ?? 0}+</span></p>
      <p>Dark Stone <span>${hero.darkstone ?? 0}</span></p>
    </div>
  `)}

  ${renderDraggableSection("Combat", `
    <div class='tile-content stats-grid'>
      <p>To Hit <span>${hero.toHit?.ranged ?? "—"}</span></p>
      <p>Melee <span>${hero.toHit?.melee ?? "—"}</span></p>
      <p>Ranged <span>${hero.stats?.Agility ?? "—"}</span></p>
    </div>
  `)}

  ${renderDraggableSection("Conditions", `
    <div class='tile-content'>
      <p><strong>Fungus Growth</strong></p>
      <p>You get Plump Fungus Side Bag Token at the start of each Adventure.</p>
    </div>
  `)}

  ${renderDraggableSection("XP & Gold", `
    <div class='tile-content stats-grid'>
      <p>XP <span>${hero.xp ?? 15000}</span></p>
      <p>Gold <span>${hero.gold ?? 350}</span></p>
    </div>
  `)}

  ${renderDraggableSection("Abilities", `
    <div class='tile-content'>
      <ul>${hero.abilities.map(a => `<li>${a}</li>`).join("")}</ul>
    </div>
  `)}

  ${renderDraggableSection("Starting Gear", `
    <div class='tile-content'>
      <ul>${hero.items.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>
  `)}
</div>

`;

hero.currHealth = hero.currHealth ?? hero.health; hero.currSanity = hero.currSanity ?? hero.sanity; }

function renderDraggableSection(title, content) { return <div class="tile" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.id)" id="section-${title.replace(/\s+/g, '')}" ondrop="const fromId = event.dataTransfer.getData('text/plain'); const fromEl = document.getElementById(fromId); this.parentNode.insertBefore(fromEl, this);"> <div class="tile-header">${title}</div> ${content} </div>; }

// --- DOM Ready Logic --- document.addEventListener("DOMContentLoaded", () => { const header = document.querySelector("h1"); if (header && !header.innerHTML.includes("v0.1.15")) { header.innerHTML += " (v0.1.15)"; }

document.querySelectorAll(".tabs button").forEach(btn => { btn.addEventListener("click", () => showTab(btn.dataset.tab)); });

console.log("HEROES.Western =", window.HEROES?.Western);

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
renderConditionsTab();
renderSkillTree();
renderSheetTab();
showTab("sheetTab");

}); });

