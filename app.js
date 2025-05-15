import { skillTree } from './skills.js';

let selectedSkills = [];

let baseStats = {
  Agility: 3, Strength: 3, Cunning: 3, Spirit: 3, Lore: 3, Luck: 3,
  Initiative: 3, Combat: 3, Grit: 1, Willpower: 3, Defense: 3,
  Health: 10, Sanity: 10
};

function calcTotalStats() {
  const total = { ...baseStats };
  selectedSkills.forEach(s => {
    const [path, index] = s.split("-");
    const row = skillTree.find(p => p.path === path)?.skills[+index];
    if (row?.effects) {
      Object.entries(row.effects).forEach(([stat, val]) => {
        if (total[stat] != null) total[stat] += val;
      });
    }
  });
  return total;
}

function renderStatsTab() {
  const stats = calcTotalStats();
  const tab = document.getElementById('statsTab');
  tab.innerHTML = '<h3>Stats (with Skill Bonuses)</h3>';
  Object.entries(stats).forEach(([stat, value]) => {
    const line = document.createElement('div');
    line.textContent = `${stat}: ${value}`;
    tab.appendChild(line);
  });
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
      const indexKey = `${path.path}-${row}`;
      const isSelected = selectedSkills.includes(indexKey);
      const canUnlock = row === 0 || selectedSkills.includes(`${path.path}-${row - 1}`);

      const btn = document.createElement('button');
      btn.textContent = skill.name;
      btn.title = skill.desc;
      btn.disabled = !canUnlock && !isSelected;
      btn.style.backgroundColor = isSelected ? 'lightgreen' : btn.disabled ? '#ddd' : '';
      btn.style.display = 'block';
      btn.style.marginBottom = '5px';

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
        renderStatsTab();
      };

      colDiv.appendChild(btn);
    });
    grid.appendChild(colDiv);
  });

  tab.appendChild(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('statsBtn').addEventListener("click", () => {
    document.getElementById('treeTab').style.display = "none";
    document.getElementById('statsTab').style.display = "block";
    renderStatsTab();
  });

  document.getElementById('treeBtn').addEventListener("click", () => {
    document.getElementById('statsTab').style.display = "none";
    document.getElementById('treeTab').style.display = "block";
    renderSkillTree();
  });

  renderStatsTab();
  renderSkillTree();
});
