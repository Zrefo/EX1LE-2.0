const fs = require('fs');
const path = require('path');
const { levelRoles, titleRoles } = require('../utils/levelRewards');

const LEVEL_CHANNEL_ID = '1071227035147583498';
const TITLE_CHANNEL_ID = '1400263230059708416';

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const filePath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');

        let data;
        try {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch {
            data = {};
        }

        if (!data[message.author.id]) {
            data[message.author.id] = { xp: 0, level: 1 };
        }

        const userData = data[message.author.id];
        const member = message.member;

        const gainedXP = Math.floor(Math.random() * 10) + 5;
        userData.xp += gainedXP;

        const nextLevelXP = Math.pow(userData.level / 0.1, 2);

        if (userData.xp >= nextLevelXP) {
            userData.level += 1;
            const newLevel = userData.level;

            const levelChannel = message.guild.channels.cache.get(LEVEL_CHANNEL_ID);
            if (levelChannel) {
                levelChannel.send(
                    `> **${member} has reached the next level! \`${newLevel}\`** 🎉`
                );
            }

            for (const roleId of Object.values(levelRoles)) {
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId).catch(() => {});
                }
            }

            const newLevelRoleId = levelRoles[newLevel];
            if (newLevelRoleId) {
                await member.roles.add(newLevelRoleId).catch(() => {});
            }

            if (titleRoles[newLevel]) {
                const title = titleRoles[newLevel];

                if (!member.roles.cache.has(title.roleId)) {
                    await member.roles.add(title.roleId).catch(() => {});

                    const titleChannel = member.guild.channels.cache.get(TITLE_CHANNEL_ID);
                    if (titleChannel) {
                        titleChannel.send(
                            `🏆 **${member} ${title.message}**`
                        );
                    }
                }
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
};
