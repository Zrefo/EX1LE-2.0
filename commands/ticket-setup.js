const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Setup ticket message')
        .setDefaultMemberPermissions(0), 

    async execute(interaction) {
        if (interaction.user.id !== '936390691603513374') {
            return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
        }

        const ticketMessagePath = path.join(__dirname, '../assets/ticket-message.json');
        const ticketData = JSON.parse(fs.readFileSync(ticketMessagePath, 'utf8'));

        const channel = interaction.guild.channels.cache.get('1279081982579707914');
        if (!channel) return interaction.reply({ content: 'Channel not found!', ephemeral: true });

        await channel.send(ticketData);

        interaction.reply({ content: 'Ticket system has been set up!', ephemeral: true });
    }
};

