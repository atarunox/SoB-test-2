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
  document.getElementById("gearTab").innerHTML = "Gear TabPlaceholder";
}

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
    <div class="character-sheet">
      <h2>${selectedHeroName}</h2>

      <div class="flex-row">
        <div>
          <p><strong>Max Health:</strong> ${hero.health}</p>
          <p><strong>Current Health:</strong> <input type="number" id="currHealth" value="${hero.health}" min="0" max="${hero.health}" /></p>
          <p><strong>Max Sanity:</strong> ${hero.sanity}</p>
          <p><strong>Current Sanity:</strong> <input type="number" id="currSanity" value="${hero.sanity}" min="0" max="${hero.sanity}" /></p>
        </div>

        <div>
          <p><strong>XP:</strong> <input type="number" id="xp" value="${hero.xp ?? 0}" /></p>
          <p><strong>Gold:</strong> <input type="number" id="gold" value="${hero.gold ?? 0}" /></p>
          <p><strong>Dark Stone:</strong> <input type="number" id="darkstone" value="${hero.darkstone ?? 0}" /></p>
          <p><strong>Corruption:</strong> <input type="number" id="corruption" value="${hero.corruption ?? 0}" max="5" /></p>
        </div>
      </div>

      <div class="flex-row">
        <div>
          <h3>Combat</h3>
          <p><strong>Combat:</strong> ${hero.combat}</p>
          <p><strong>Initiative:</strong> ${hero.stats?.Initiative ?? "—"}</p>
          <p><strong>Defense:</strong> ${hero.defense}</p>
          <p><strong>Willpower:</strong> ${hero.willpower}</p>
          <p><strong>Ranged To-Hit:</strong> ${hero.toHit.ranged}</p>
          <p><strong>Melee To-Hit:</strong> ${hero.toHit.melee}</p>
        </div>

        <div>
          <h3>Core Stats</h3>
          <ul>
            ${Object.entries(hero.stats).map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div>
        <h3>Abilities</h3>
        <ul>${hero.abilities.map(a => `<li>${a}</li>`).join("")}</ul>
      </div>

      <div>
        <h3>Starting Gear</h3>
        <ul>${hero.items.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>

      <div>
        <h3>Adventure Toggles</h3>
        <button onclick="this.classList.toggle('used')">Ability 1 (Once per Adventure)</button>
        <button onclick="this.classList.toggle('used')">Item Use (Once per Adventure)</button>
      </div>
    </div>
  `;
}

// --- Optional CSS ---
/*
.character-sheet {
  font-family: sans-serif;
  background: #f9f6ec;
  padding: 1em;
  border-radius: 8px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  gap: 2em;
  margin-bottom: 1em;
}

.flex-row div {
  flex: 1;
}

.used {
  background: #999;
  text-decoration: line-through;
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
