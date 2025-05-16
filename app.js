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
    <div class="character-sheet-grid" id="sheetSections" ondragover="event.preventDefault()">
      ${renderDraggableSection("Vitals", `
        <div class='tile-content'>
          <p>Health ${hero.currHealth ?? hero.health}/${hero.health}</p>
          <p>Sanity ${hero.currSanity ?? hero.sanity}/${hero.sanity}</p>
          <p>Grit ${hero.maxGrit}/${hero.maxGrit}</p>
          <p>Willpower ${hero.willpower}</p>
          <p>Defense ${hero.defense}</p>
        </div>
      `)}

      ${renderDraggableSection("Stats", `
        <div class='tile-content'>
          ${Object.entries(hero.stats).map(([key, val]) => `<p>${key} ${val}</p>`).join("")}
          <p>Corruption ${hero.corruption ?? 0}+</p>
          <p>Dark Stone ${hero.darkstone ?? 0}</p>
        </div>
      `)}

      ${renderDraggableSection("Combat", `
        <div class='tile-content'>
          <p>To Hit ${hero.toHit?.ranged ?? "—"}</p>
          <p>Melee ${hero.toHit?.melee ?? "—"}</p>
          <p>Ranged ${hero.stats?.Agility ?? "—"}</p>
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

  // Update live values
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
  border: 1px solid #a29074;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  padding: 0.5em 1em;
}

.tile-header {
  font-weight: bold;
  font-size: 1.2em;
  border-bottom: 2px solid #a29074;
  padding-bottom: 0.3em;
  margin-bottom: 0.5em;
}

.tile-content p,
.tile-content li {
  margin: 0.2em 0;
  font-size: 1em;
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
