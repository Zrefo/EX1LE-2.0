const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Wyświetla top 10 użytkowników z największym poziomem'),
    
    async execute(interaction) {
        const levelsPath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(levelsPath)) {
            return interaction.reply('Brak danych o poziomach!');
        }

        const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));

        // Zamiana obiektu na tablicę i sortowanie po level i xp
        const sorted = Object.entries(data)
            .map(([id, info]) => ({ id, level: info.level, xp: info.xp }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .slice(0, 10); // top 10

        // Canvas
        const canvas = Canvas.createCanvas(450, 800);
        const ctx = canvas.getContext('2d');

        // tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ustawienia tekstu
        ctx.fillStyle = '#9b59b6';
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'left';

        let y = 50; // start od góry

        for (let i = 0; i < sorted.length; i++) {
            const entry = sorted[i];
            const member = await interaction.guild.members.fetch(entry.id).catch(() => null);
            const username = member ? member.user.username.toUpperCase() : 'UNKNOWN';

            // miejsce
            ctx.fillText(`${i + 1}.`, 20, y);

            // nazwa
            ctx.fillText(username, 60, y);

            // poziom po prawej
            ctx.textAlign = 'right';
            ctx.fillText(`LEVEL ${entry.level}`, canvas.width - 20, y);

            // reset align do lewej
            ctx.textAlign = 'left';

            y += 60; // odstęp między użytkownikami
        }

        const buffer = canvas.toBuffer();
        await interaction.reply({ files: [{ attachment: buffer, name: 'top.png' }] });
    }
};
