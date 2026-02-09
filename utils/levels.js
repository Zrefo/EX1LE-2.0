const fs = require("fs");
const file = "./levels.json";

function load() {
  return JSON.parse(fs.readFileSync(file));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function addXP(userId) {
  const data = load();

  if (!data[userId]) data[userId] = { xp: 0, level: 1 };

  data[userId].xp += Math.floor(Math.random() * 10) + 5;

  const needed = data[userId].level * 100;
  if (data[userId].xp >= needed) {
    data[userId].xp = 0;
    data[userId].level++;
  }

  save(data);
}

module.exports = { addXP, load };
