const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const levelsPath = path.join(__dirname, '../data/levels.json');
if (!fs.existsSync(levelsPath)) fs.writeFileSync(levelsPath, '{}');

function updateLevel(userId) {
    const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
    if (!data[userId]) data[userId] = { xp: 0, level: 1 };

    data[userId].xp += Math.floor(Math.random() * 10) + 5; // losowe XP
    fs.writeFileSync(levelsPath, JSON.stringify(data, null, 2));
    return data[userId];
}

function xpToLevel(xp) {
    return Math.floor(0.1 * Math.sqrt(xp));
}

function checkLevelUp(message, userData) {
    const newLevel = xpToLevel(userData.xp);
    if (newLevel > userData.level) {
        userData.level = newLevel;
        const levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
        levels[message.author.id] = userData;
        fs.writeFileSync(levelsPath, JSON.stringify(levels, null, 2));

        const channel = message.guild.channels.cache.get(config.levelUpChannelId);
        if (channel) {
            channel.send(`**<@${message.author.id}> Has reached the next level! \`${newLevel}\`** 🎉`);
        }
    }
}

module.exports = { updateLevel, checkLevelUp, xpToLevel };
