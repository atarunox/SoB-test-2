import { gearList } from './gearList.js';

let currentHero = null;
let selectedHeroName = "";
let currentStats = {};
let customGearList = [];

// --- Library Data ---
const libraryData = {
  "Side Bag Tokens": [
    { name: "Bandages", description: "Heal 1D6 Health. Discard after use." },
    { name: "Whiskey", description: "Recover 1D6 Sanity. Discard after use." },
    { name: "Dynamite", description: "Throw to hit all enemies in a space for 3D6 damage (1x use)." },
    { name: "Flash Bang", description: "Enemies in space are -1 Defense until end of next turn." },
    { name: "Lantern Oil", description: "Recharge Lantern. Required after rolling a 1 on Lantern roll." }
  ],
  "Status Effects": [
    { name: "Bleeding", description: "Lose 1 Health at end of each turn until bandaged." },
    { name: "Poisoned", description: "Roll a D6 each turn. On 1, take 1 damage. Ends on 6+." },
    { name: "Stunned", description: "Lose 1 Action and -1 Initiative next turn." },
    { name: "Burning", description: "Take 1D6 Fire Damage at end of each turn. Ends on 4+." }
  ]
};

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
    const gear = [...gearList, ...customGearList].find(g => g.id === gearId);
    if (!gear) return;

    currentHero.inventory = currentHero.inventory.filter(g => g.id !== gearId);
    if (currentHero.gear[slot]) currentHero.inventory.push(currentHero.gear[slot]);
    currentHero.gear[slot] = gear;
  }

  currentStats = calculateCurrentStats(currentHero);
  renderGearTab();
  renderSheetTab();
};

function renderDraggableSection(title, content) {
  return `
    <div class="tile stat-tile" draggable="true"
      ondragstart="event.dataTransfer.setData('text/plain', this.id)"
      id="section-${title.replace(/\s+/g, '')}"
      ondrop="const fromId = event.dataTransfer.getData('text/plain');
              const fromEl = document.getElementById(fromId);
              this.parentNode.insertBefore(fromEl, this);">
      <div class="tile-header">${title}</div>
      ${content}
    </div>
  `;
}

function renderSheetTab() {
  const tab = document.getElementById("sheetTab");
  if (!currentHero) {
    tab.innerHTML = "<p>No hero selected.</p>";
    return;
  }

  const statTiles = ["Health", "Sanity", "Defense", "Willpower", "Initiative", "Grit", "Corruption"];

  tab.innerHTML = `
    <div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()">
      ${statTiles.map(stat => {
        const value = stat === "Corruption"
          ? \`\${currentHero.corruption ?? 0}+\`
          : \`<span class="stat-breakdown" data-stat="\${stat}">\${currentStats[stat] ?? "—"}</span>\`;
        return renderDraggableSection(stat, \`
          <div class='tile-content'><p><strong>\${value}</strong></p></div>
        \`);
      }).join("")}
    </div>
  `;

  setupStatBreakdownListeners();
}

function setupStatBreakdownListeners() {
  let pressTimer = null;

  document.querySelectorAll('.stat-breakdown').forEach(el => {
    const stat = el.dataset.stat;
    const showBreakdown = () => {
      const base = currentHero.stats?.[stat] ?? 0;
      const gearBonus = Object.values(currentHero.gear || {}).reduce(
        (sum, item) => sum + (item?.effects?.[stat] || 0), 0
      );
      const total = base + gearBonus;
      alert(\`\${stat} = \${base} (base) + \${gearBonus} (gear)\nTotal: \${total}\`);
    };

    el.addEventListener('mousedown', e => {
      e.preventDefault();
      pressTimer = setTimeout(showBreakdown, 600);
    });
    el.addEventListener('mouseup', () => clearTimeout(pressTimer));
    el.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    el.addEventListener('touchstart', () => {
      pressTimer = setTimeout(showBreakdown, 600);
    });
    el.addEventListener('touchend', () => clearTimeout(pressTimer));
  });
}

function renderLibrarySection(data) {
  return Object.entries(data).map(([category, entries]) => `
    <div class="panel">
      <h3 onclick="this.nextElementSibling.classList.toggle('hidden')">${category}</h3>
      <ul class="hidden">
        ${entries.map(entry => `<li><strong>${entry.name}</strong>: ${entry.description}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

function renderMiscTab() {
  const tab = document.getElementById("miscTab");
  tab.innerHTML = `
    <h2>Custom Gear (Coming Soon)</h2>
    <p>Form for creating custom gear will go here.</p>
    <h2>Library</h2>
    ${renderLibrarySection(libraryData)}
  `;
}

function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.style.display = el.id === tabName ? "block" : "none";
  });
}

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

          renderSheetTab();
          renderGearTab();
          renderMiscTab();
          showTab("sheetTab");
        }
      });
    }

    renderSheetTab();
    renderGearTab();
    renderMiscTab();
    showTab("sheetTab");
  });
});