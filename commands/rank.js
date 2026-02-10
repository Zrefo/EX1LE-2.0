const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const { xpToLevel } = require('../utils/levelHelper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Wyświetla Twój poziom'),
    
    async execute(interaction) {
        const levelsPath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(levelsPath)) {
            return interaction.reply('Brak danych o poziomach!');
        }

        const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));

        const userData = data[interaction.user.id] || { xp: 0, level: 1 };

        // Obliczenie miejsca w rankingu
        const sorted = Object.entries(data)
            .map(([id, info]) => ({ id, level: info.level, xp: info.xp }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp);
        const rank = sorted.findIndex(u => u.id === interaction.user.id) + 1;

        // Canvas 800x350
        const canvas = Canvas.createCanvas(800, 350);
        const ctx = canvas.getContext('2d');

        // Załaduj tło
        const background = await Canvas.loadImage(path.join(__dirname, '../assets/rank-bg.png'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Awatar
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'png' }));
        ctx.save();
        ctx.beginPath();
        ctx.arc(400, 150, 75, 0, Math.PI * 2, true); // okrągły awatar
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 325, 75, 150, 150);
        ctx.restore();

        // Tekst: RANK po lewej
        ctx.fillStyle = '#9b59b6';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`RANK: ${userData.level}`, 50, 100);

        // Tekst: miejsce po prawej
        ctx.textAlign = 'right';
        ctx.fillText(`#${rank}`, 750, 100);

        // Pasek postępu pod awatarem
        const nextLevelXP = Math.pow(userData.level / 0.1, 2); // odwrócone xpToLevel
        const currentXP = userData.xp;
        const progress = Math.min((currentXP / nextLevelXP) * 100, 100);

        const barWidth = 400;
        const barHeight = 30;
        const barX = 200;
        const barY = 300;

        // tło paska
        ctx.fillStyle = '#555555';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // fioletowy pasek
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(barX, barY, (progress / 100) * barWidth, barHeight);

        // tekst % w pasku
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(progress)}%`, barX + barWidth / 2, barY + 22);

        // Wyślij obraz
        const buffer = canvas.toBuffer();
        await interaction.reply({ files: [{ attachment: buffer, name: 'rank.png' }] });
    }
};
