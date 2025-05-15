import { skillTree } from './skills.js';

let selectedSkills = [];

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

function renderSkillTree() {
  const tab = document.getElementById('treeTab');
  tab.innerHTML = '<h3>Skill Tree (Max 7)</h3>';
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${skillTree.length}, 1fr)`;
  grid.style.gap = '10px';

  skillTree.forEach((path, col) => {
    const colDiv = document.createElement('div');
    path.skills.forEach((skill, row) => {
      const btn = document.createElement('button');
      btn.textContent = skill;
      btn.style.display = 'block';
      btn.style.marginBottom = '5px';

      const indexKey = `${path.path}-${row}`;
      const isSelected = selectedSkills.includes(indexKey);

      // Determine if this skill is unlockable
      const canUnlock =
        row === 0 ||
        selectedSkills.includes(`${path.path}-${row - 1}`);

      btn.disabled = !canUnlock && !isSelected;
      btn.style.backgroundColor = isSelected ? 'lightgreen' : btn.disabled ? '#ddd' : '';

      btn.onclick = () => {
        if (isSelected) {
          selectedSkills = selectedSkills.filter(s => s !== indexKey);
        } else {
          if (selectedSkills.length < 7) {
            selectedSkills.push(indexKey);
          } else {
            alert("You can only select up to 7 skills.");
          }
        }
        renderSkillTree();
      };

      colDiv.appendChild(btn);
    });
    grid.appendChild(colDiv);
  });

  tab.appendChild(grid);
}

function showSkillTree() {
  showTab('treeTab');
  renderSkillTree();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      if (tabId === "treeTab") showSkillTree();
      else showTab(tabId);
    });
  });
});
