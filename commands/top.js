const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Shows top 10 with the highest level'),

    async execute(interaction) {
        const levelsPath = path.join(__dirname, '../data/levels.json');
        if (!fs.existsSync(levelsPath)) return interaction.reply('Brak danych o poziomach!');

        const data = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));

        const sorted = Object.entries(data)
            .map(([id, info]) => ({ id, level: info.level, xp: info.xp }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .slice(0, 10);

        const canvas = Canvas.createCanvas(450, 800);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(path.join(__dirname, '../assets/top-bg.png'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#b700ff';
        ctx.shadowColor = '#9b59b6';
        ctx.shadowBlur = 20;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 30px sans-serif'; 

        let y = 100;

        for (let i = 0; i < sorted.length; i++) {
            const entry = sorted[i];
            const member = await interaction.guild.members.fetch(entry.id).catch(() => null);
            const username = member ? member.user.username.toUpperCase() : 'UNKNOWN';

            ctx.fillText(`${i + 1}. ${username} - LEVEL ${entry.level}`, canvas.width / 2, y);
            y += 70;
        }

        const buffer = canvas.toBuffer();
        await interaction.reply({ files: [{ attachment: buffer, name: 'top.png' }] });
    }
};
