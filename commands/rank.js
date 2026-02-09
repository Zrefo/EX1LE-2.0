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
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/levels.json')));
        const userData = data[interaction.user.id] || { xp: 0, level: 1 };

        const canvas = Canvas.createCanvas(800, 350);
        const ctx = canvas.getContext('2d');

        // tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // awatar
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'png' }));
        ctx.drawImage(avatar, 325, 50, 150, 150);

        // RANK
        ctx.fillStyle = '#9b59b6';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`RANK: ${userData.level}`, 50, 100);

        // TODO: pasek postępu i miejsce w rankingu

        const attachment = { files: [{ attachment: canvas.toBuffer(), name: 'rank.png' }] };
        await interaction.reply({ files: [canvas.toBuffer()] });
    }
};
