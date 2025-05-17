import { gearList } from './gearList.js';

// --- Global State ---
let currentHero = null;
let selectedHeroName = "";
let currentStats = {};

// --- Stat Calculation ---
function calculateCurrentStats(hero) {
  const base = { ...hero.stats };
  const bonuses = {};

  if (hero.gear) {
    Object.values(hero.gear).forEach(item => {
      if (item?.effects) {
        for (const [key, value] of Object.entries(item.effects)) {
          bonuses[key] = (bonuses[key] || 0) + value;
        }
      }
    });
  }

  const result = {};
  for (const key of Object.keys(base)) {
    result[key] = base[key] + (bonuses[key] || 0);
  }

  result.Health = hero.health + (bonuses.Health || 0);
  result.Sanity = hero.sanity + (bonuses.Sanity || 0);
  result.Grit = hero.maxGrit + (bonuses.Grit || 0);
  result.Initiative = result.Initiative || hero.stats.Initiative;
  result.Defense = hero.defense;
  result.Willpower = hero.willpower;

  return result;
}

// --- Tab Renders ---
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

  currentHero.gear = currentHero.gear ?? {};
  currentHero.inventory = currentHero.inventory ?? [];
  const gearSlots = ["Head", "Torso", "Coat", "Gloves", "Hands", "Pants", "Feet", "Shoulders", "Face", "Extra 1", "Extra 2"];

  tab.innerHTML = `
    <div class="quick-stats">
      <div class="quick-tile"><div class="label">Grit</div><div class="value">${currentStats.Grit}</div></div>
      <div class="quick-tile"><div class="label">Initiative</div><div class="value">${currentStats.Initiative}</div></div>
      <div class="quick-tile"><div class="label">Corruption</div><div class="value">${currentHero.corruption ?? 0}+</div></div>
    </div>

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
              ${currentHero.inventory
                .filter(g => g.slot === slot)
                .map(g => `<option value="${g.id}" ${equipped?.id === g.id ? "selected" : ""}>${g.name}</option>`)
                .join("")}
            </select>
          </div>
        `;
      }).join("")}
    </div>

    <h2>Inventory</h2>
    <ul>
      ${currentHero.inventory.length === 0
        ? "<li>(Empty)</li>"
        : currentHero.inventory.map(g => `<li>${g.name}</li>`).join("")}
    </ul>
  `;
}

window.equipGear = function (slot, gearId) {
  if (gearId === "") {
    if (currentHero.gear[slot]) {
      currentHero.inventory.push(currentHero.gear[slot]);
      delete currentHero.gear[slot];
    }
  } else {
    const gear = gearList.find(g => g.id === gearId);
    if (!gear) return;

    currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
    if (currentHero.gear[slot]) currentHero.inventory.push(currentHero.gear[slot]);
    currentHero.gear[slot] = gear;
  }

  currentStats = calculateCurrentStats(currentHero);
  renderGearTab();
  renderStatsTab();
};

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
        <div class="tile-content vitals-group">
          <div class="vital-pair">
            <div class="vital-box">
              <div class="tile-header">Health</div>
              <p><strong>${hero.currHealth ?? hero.health}/${hero.health}</strong></p>
              <div class="tile-header">Defense</div>
              <p><strong>${hero.defense}</strong></p>
            </div>
            <div class="vital-box">
              <div class="tile-header">Sanity</div>
              <p><strong>${hero.currSanity ?? hero.sanity}/${hero.sanity}</strong></p>
              <div class="tile-header">Willpower</div>
              <p><strong>${hero.willpower}</strong></p>
            </div>
          </div>
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
    <div class="tile" draggable="true"
      ondragstart="event.dataTransfer.setData('text/plain', this.id)"
      id="section-${title.replace(/\s+/g, '')}"
      ondrop="const fromId = event.dataTransfer.getData('text/plain'); const fromEl = document.getElementById(fromId); this.parentNode.insertBefore(fromEl, this);">
      <div class="tile-header">${title}</div>
      ${content}
    </div>
  `;
}

// --- Tab Switching ---
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.style.display = el.id === tabName ? "block" : "none";
  });
}

// --- Page Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("h1");
  if (header && !header.innerHTML.includes("v0.1.15")) {
    header.innerHTML += " (v0.1.15)";
  }

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

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
  });
});
