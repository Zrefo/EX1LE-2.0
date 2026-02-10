const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allies')
        .setDescription('Show all EX1LE allies'),

    async execute(interaction) {
        const member = interaction.member;

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !member.roles.cache.has('1079360096338976828')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const filePath = path.join(__dirname, '../data/allies.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');

        const allies = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('EX1LE ALLIES')
            .setDescription(allies.length ? allies.join('\n') : 'No allies yet.');

        await interaction.reply({ embeds: [embed] });
    }
};
