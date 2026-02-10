const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Displays your level'),

    async execute(interaction) {
        const levelsPath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(levelsPath)) return interaction.reply('Brak danych o poziomach!');

        const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
        const userData = data[interaction.user.id] || { xp: 0, level: 1 };

        const sorted = Object.entries(data)
            .map(([id, info]) => ({ id, level: info.level, xp: info.xp }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp);
        const rank = sorted.findIndex(u => u.id === interaction.user.id) + 1;

        // Canvas
        const canvas = Canvas.createCanvas(800, 350);
        const ctx = canvas.getContext('2d');

        // Tło
        const background = await Canvas.loadImage(path.join(__dirname, '../assets/rank-bg.png'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Awatar
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'png' }));
        ctx.save();
        ctx.beginPath();
        ctx.arc(400, 150, 75, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 325, 75, 150, 150);
        ctx.restore();

        // Efekt glow i tekst
        ctx.shadowColor = '#b700ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#b700ff';
        ctx.font = 'bold 50px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Teksty
        ctx.fillText(`RANK: ${userData.level}`, 200, 150);
        ctx.fillText(`#${rank}`, 600, 150);

        // Pasek postępu
        const nextLevelXP = Math.pow(userData.level / 0.1, 2);
        const progress = Math.min((userData.xp / nextLevelXP) * 100, 100);

        const barWidth = 300;
        const barHeight = 40;
        const barX = 250;
        const barY = 260;

        // Ramka paska
        ctx.strokeStyle = '#b700ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 20); // zaokrąglone rogi
        ctx.stroke();

        // Tło paska (czarne)
        ctx.fillStyle = '#000000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Wypełnienie fioletowe z glow
        ctx.shadowColor = '#8e44ad';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#b300ff';
        ctx.fillRect(barX, barY, (progress / 100) * barWidth, barHeight);
        ctx.shadowBlur = 0;

        // Procent na pasku
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.floor(progress)}%`, barX + barWidth / 2, barY + barHeight / 2);

        // Wyślij obraz
        const buffer = canvas.toBuffer();
        await interaction.reply({ files: [{ attachment: buffer, name: 'rank.png' }] });
    }
};
