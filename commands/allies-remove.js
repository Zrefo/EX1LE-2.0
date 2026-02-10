const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allies-remove')
        .setDescription('Remove an ally')
        .addStringOption(option =>
            option.setName('guild')
                .setDescription('The guild name to remove')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.member;

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const guildName = interaction.options.getString('guild').trim();

        const filePath = path.join(__dirname, '../data/allies.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');

        const allies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!allies.includes(guildName)) {
            return interaction.reply({ content: 'This guild is not in the allies list.', ephemeral: true });
        }

        const updatedAllies = allies.filter(g => g !== guildName);
        fs.writeFileSync(filePath, JSON.stringify(updatedAllies, null, 2));

        await interaction.reply({ content: `Guild \`${guildName}\` has been removed from allies.`, ephemeral: true });
    }
};
