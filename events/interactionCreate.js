const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        // =======================
        // Obsługa komend
        // =======================
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Błąd podczas wykonywania komendy!', ephemeral: true });
            }
            return;
        }

        // =======================
        // Obsługa przycisków
        // =======================
        if (interaction.isButton()) {
            // Kliknięcie przycisku "OPEN THE TICKET"
            if (interaction.customId === 'open_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId(`ticket_modal_${interaction.user.id}`)
                    .setTitle('Open a Ticket');

                const nicknameInput = new TextInputBuilder()
                    .setCustomId('ticket_nickname')
                    .setLabel('Your nickname:')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const issueInput = new TextInputBuilder()
                    .setCustomId('ticket_issue')
                    .setLabel('How we can help you?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(nicknameInput));
                modal.addComponents(new ActionRowBuilder().addComponents(issueInput));

                await interaction.showModal(modal);
            }

            // Kliknięcie przycisku "Close Ticket"
            else if (interaction.customId === 'close_ticket') {
                const channel = interaction.channel;

                // Odbierz dostęp użytkownikowi który utworzył ticketa
                const memberId = channel.name.split('-').pop(); // zakładamy format nazwy ticket-username
                const member = channel.guild.members.cache.get(memberId);
                if (member) {
                    await channel.permissionOverwrites.edit(member.id, { ViewChannel: false });
                }

                // Przenieś do kategorii archiwum
                await channel.setParent('1270211226269646951');

                // Wyślij info i ustaw usuwanie po 24h
                const timestamp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Discord timestamp
                await channel.send(`> **This ticket will be deleted in <t:${timestamp}:R>**`);

                setTimeout(() => {
                    channel.delete().catch(() => {});
                }, 24 * 60 * 60 * 1000);
            }
            return;
        }

        // =======================
        // Obsługa modal submit
        // =======================
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('ticket_modal_')) {
                const nickname = interaction.fields.getTextInputValue('ticket_nickname');
                const issue = interaction.fields.getTextInputValue('ticket_issue');

                const categoryId = '1270135140546383942'; // Ticket category
                const roleId = '1270155595105701908'; // Rola supportu

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: 0, // GUILD_TEXT
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: roleId,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                // Wyślij wiadomość w nowym kanale
                const createdMessagePath = path.join(__dirname, '../assets/ticket-created.json');
                const messageData = JSON.parse(fs.readFileSync(createdMessagePath, 'utf8'));

                await channel.send({
                    content: `Nickname: \`${nickname}\`\nIssue: \`${issue}\``,
                    components: messageData.components
                });

                await interaction.reply({ content: `Your ticket has been created: ${channel}`, ephemeral: true });
            }
            return;
        }
    }
};
