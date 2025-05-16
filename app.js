// --- Tab Render Functions ---
let currentHero = null;
let selectedHeroName = "";
let currentStats = {}; // <-- optional if still used

function renderStatsTab() {
  const tab = document.getElementById("statsTab");
  tab.innerHTML = `
    <h2>Stats</h2>
    <ul>
      <li>Health: ${currentStats.Health}</li>
      <li>Sanity: ${currentStats.Sanity}</li>
      <li>Grit: ${currentStats.Grit}</li>
    </ul>
  `;
}

function renderGearTab() {
  const tab = document.getElementById("gearTab");
  if (!currentHero) {
    tab.innerHTML = "<p>No hero selected.</p>";
    return;
  }

  // Initialize gear structure if not present
  currentHero.gear = currentHero.gear ?? {};
  currentHero.inventory = currentHero.inventory ?? [];

  const gearSlots = ["Head", "Torso", "Coat", "Gloves", "Hands", "Pants", "Feet", "Shoulders", "Face", "Extra 1", "Extra 2"];

  tab.innerHTML = `
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
  <option value="">(Empty)</option>
  ${currentHero.inventory
    .filter(g => g.slot === slot)
    .map(g => `<option value="${g.id}">${g.name}</option>`)
    .join("")}
</select>

          </div>
        `;
      }).join("")}
    </div>

    <h2>Inventory</h2>
    <ul>
      ${currentHero.inventory.length === 0 ? "<li>(Empty)</li>" : currentHero.inventory.map(g => `<li>${g.name}</li>`).join("")}
    </ul>
  `;
}

// Equip handler (attach globally)
window.equipGear = function (slot, gearId) {
  if (!gearId) return;

  const gear = gearList.find(g => g.id === gearId);
  if (!gear) return;

  // Remove from inventory and assign to slot
  window.equipGear = function (slot, gearId) {
  if (gearId === "") {
    if (currentHero.gear[slot]) {
      currentHero.inventory.push(currentHero.gear[slot]); // return to inventory
      delete currentHero.gear[slot];
    }
  } else {
    const gear = gearList.find(g => g.id === gearId);
    if (!gear) return;

    currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
    if (currentHero.gear[slot]) {
      currentHero.inventory.push(currentHero.gear[slot]); // swap out old
    }
    currentHero.gear[slot] = gear;
  }

  renderGearTab();
  renderStatsTab();
};



function renderConditionsTab() {
  document.getElementById("conditionsTab").innerHTML = "Conditions TabPlaceholder";
}

function renderSkillTree() {
  document.getElementById("treeTab").innerHTML = "Skill Tree TabPlaceholder";
}
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.style.display = el.id === tabName ? "block" : "none";
  });
}

// --- Character Sheet Tab ---
function renderSheetTab() {
  const tab = document.getElementById("sheetTab");
  const hero = currentHero;
  if (!hero) {
    tab.innerHTML = "<p>No hero selected.</p>";
    return;
  }

  tab.innerHTML = `
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

  hero.currHealth = hero.currHealth ?? hero.health;
  hero.currSanity = hero.currSanity ?? hero.sanity;
}

function renderDraggableSection(title, content) {
  return `
    <div class="tile" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.id)" id="section-${title.replace(/\s+/g, '')}" ondrop="const fromId = event.dataTransfer.getData('text/plain'); const fromEl = document.getElementById(fromId); this.parentNode.insertBefore(fromEl, this);">
      <div class="tile-header">${title}</div>
      ${content}
    </div>
  `;
}

// --- Optional CSS ---
/*
.character-sheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1em;
  font-family: 'Georgia', serif;
  background: #f6edd9;
  padding: 1em;
  border-radius: 8px;
}

.tile {
  background: #f4e6c1;
  border: 1px solid #988464;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  padding: 0.75em 1em;
}

.tile-header {
  font-weight: bold;
  font-size: 1.1em;
  border-bottom: 1px solid #a29074;
  padding-bottom: 0.3em;
  margin-bottom: 0.5em;
  letter-spacing: 0.5px;
}

.tile-content p,
.tile-content li {
  margin: 0.25em 0;
  font-size: 1em;
}

.stats-grid p {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d2c4aa;
}

.stats-grid span {
  font-weight: bold;
}
*/






// --- DOM Ready Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("h1");
  if (header && !header.innerHTML.includes("v0.1.15")) {
    header.innerHTML += " (v0.1.15)";
  }

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  console.log("HEROES.Western =", window.HEROES?.Western);

  function waitForHeroes(callback, retries = 10) {
    if (window.HEROES?.Western) {
      callback();
    } else if (retries > 0) {
      setTimeout(() => waitForHeroes(callback, retries - 1), 100);
    } else {
      console.error("HEROES.Western not found");
    }
  }

  waitForHeroes(() => {
    const heroSelect = document.querySelector("#heroSelect");
    if (heroSelect) {
      heroSelect.innerHTML = Object.keys(HEROES.Western)
        .map(k => `<option value="${k}">${k}</option>`)
        .join("");

      heroSelect.addEventListener("change", e => {
  const heroName = e.target.value;
  const hero = HEROES.Western[heroName];
  if (hero) {
    selectedHeroName = heroName;
    currentHero = hero;

    currentStats.Health = hero.health;
    currentStats.Sanity = hero.sanity;
    currentStats.Grit = hero.maxGrit;

    renderStatsTab(); // Optional
    renderSheetTab(); // ✅ This ensures the Character Sheet loads
    showTab("sheetTab"); // Optional: auto-switch to Sheet tab
  }
});

    }

    renderStatsTab(); // Initial placeholder
    renderGearTab();
    renderConditionsTab();
    renderSkillTree();
    renderSheetTab();
    showTab("sheetTab");
  });
});
