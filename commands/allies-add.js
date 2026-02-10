const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const NOTIFY_CHANNEL_ID = '1465016795256717473';
const ROLE_ID = '1079360096338976828';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allies-add')
        .setDescription('Add a new ally')
        .addStringOption(option =>
            option.setName('guild')
                .setDescription('The guild name to add')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.member;

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const guildName = interaction.options.getString('guild').trim();
        if (!guildName) return interaction.reply({ content: 'Guild name cannot be empty.', ephemeral: true });

        const filePath = path.join(__dirname, '../data/allies.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');

        const allies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (allies.includes(guildName)) {
            return interaction.reply({ content: 'This guild is already an ally.', ephemeral: true });
        }

        allies.push(guildName);
        fs.writeFileSync(filePath, JSON.stringify(allies, null, 2));

        const notifyChannel = interaction.guild.channels.cache.get(NOTIFY_CHANNEL_ID);
        if (notifyChannel) {
            notifyChannel.send(`> **Hey <@&${ROLE_ID}>, please welcome our new ally \`${guildName}\`** ✨`);
        }

        await interaction.reply({ content: `Guild \`${guildName}\` has been added as an ally.`, ephemeral: true });
    }
};
