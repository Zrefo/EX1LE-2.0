const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const filePath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');

        // Wczytaj dane
        const rawData = fs.readFileSync(filePath, 'utf8');
        let data = {};
        try {
            data = JSON.parse(rawData);
        } catch (err) {
            console.error('Błąd parsowania levels.json:', err);
            data = {};
        }

        if (!data[message.author.id]) data[message.author.id] = { xp: 0, level: 1 };

        // Dodaj losowe XP
        const gainedXP = Math.floor(Math.random() * 10) + 5;
        data[message.author.id].xp += gainedXP;

        // Oblicz wymagane XP do następnego levelu
        const nextLevelXP = Math.pow(data[message.author.id].level / 0.1, 2);
        if (data[message.author.id].xp >= nextLevelXP) {
            data[message.author.id].level += 1;
            const channel = message.guild.channels.cache.get('1071227035147583498');
            if (channel) channel.send(`> **<@${message.author.id}> Has reached the next level! \`${data[message.author.id].level}\`** 🎉`);
        }

        // Zapisz dane z powrotem
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
};
