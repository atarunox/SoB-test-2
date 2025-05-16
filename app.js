// Hero Tracker v0.1.15 â€” Clean rebuild with HEROES external

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("h1");
  if (header && !header.innerHTML.includes("v0.1.15")) {
    header.innerHTML += " <span style='font-size:0.7em'>(v0.1.15)</span>";
  }

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  const heroSelect = document.querySelector("#heroSelect");
  if (heroSelect && window.HEROES?.Western) {
    heroSelect.innerHTML = Object.keys(HEROES.Western).map(k => `<option value="${k}">${k}</option>`).join("");
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
});
