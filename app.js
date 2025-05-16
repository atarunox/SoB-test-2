// DEBUG MODE ENABLED
function log(msg) {
  const logArea = document.getElementById("debugLog") || (() => {
    const box = document.createElement("div");
    box.id = "debugLog";
    box.style.position = "fixed";
    box.style.bottom = "0";
    box.style.left = "0";
    box.style.right = "0";
    box.style.maxHeight = "200px";
    box.style.overflowY = "auto";
    box.style.background = "black";
    box.style.color = "lime";
    box.style.fontSize = "12px";
    box.style.padding = "4px";
    document.body.appendChild(box);
    return box;
  })();
  const line = document.createElement("div");
  line.textContent = msg;
  logArea.appendChild(line);
}

// Minimal setup just to confirm each render function loads
function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    log("Switched to tab: " + id);
  }
}

function renderStatsTab() {
  log("renderStatsTab() called");
  const tab = document.getElementById("statsTab");
  if (tab) tab.innerHTML = "<h3>Stats Tab Loaded</h3>";
}

function renderGearTab() {
  log("renderGearTab() called");
  const tab = document.getElementById("gearTab");
  if (tab) tab.innerHTML = "<h3>Gear Tab Loaded</h3>";
}

function renderConditionsTab() {
  log("renderConditionsTab() called");
  const tab = document.getElementById("conditionsTab");
  if (tab) tab.innerHTML = "<h3>Conditions Tab Loaded</h3>";
}

function renderSkillTree() {
  log("renderSkillTree() called");
  const tab = document.getElementById("treeTab");
  if (tab) tab.innerHTML = "<h3>Skill Tree Loaded</h3>";
}

function renderSheetTab() {
  log("renderSheetTab() called");
  const tab = document.getElementById("sheetTab");
  if (tab) tab.innerHTML = "<h3>Character Sheet Loaded</h3>";
}

window.addEventListener("error", function(e) {
  log("JS ERROR: " + e.message + " at " + e.filename + ":" + e.lineno);
});

document.addEventListener("DOMContentLoaded", () => {
  try {
    document.querySelectorAll(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => showTab(btn.dataset.tab));
    });
    renderStatsTab();
    renderGearTab();
    renderConditionsTab();
    renderSkillTree();
    renderSheetTab();
    showTab("statsTab");
  } catch (err) {
    log("INIT ERROR: " + err.message);
  }
});
