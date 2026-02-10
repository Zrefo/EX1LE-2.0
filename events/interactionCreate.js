const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

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

        if (interaction.isButton()) {

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

            else if (interaction.customId === 'close_ticket') {
                const channel = interaction.channel;

                const memberId = channel.name.split('-').pop();
                const member = channel.guild.members.cache.get(memberId);
                if (member) {
                    await channel.permissionOverwrites.edit(member.id, { ViewChannel: false });
                }

                await channel.setParent('1270211226269646951');

                const timestamp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
                await channel.send(`> **This ticket will be deleted in <t:${timestamp}:R>**`);

                setTimeout(() => {
                    channel.delete().catch(() => {});
                }, 24 * 60 * 60 * 1000);
            }
            return;
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('ticket_modal_')) {
                const nickname = interaction.fields.getTextInputValue('ticket_nickname');
                const issue = interaction.fields.getTextInputValue('ticket_issue');

                const categoryId = '1270135140546383942';
                const roleId = '1270155595105701908';

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: 0,
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

                const createdMessagePath = path.join(__dirname, '../assets/ticket-created.json');
                const messageData = JSON.parse(fs.readFileSync(createdMessagePath, 'utf8'));

                await channel.send({
                    content: `**✨Nickname: \`${nickname}\`\n⚠️Issue: \`${issue}\`\nPlease avoid pinging, I already did it :) <@&1270155595105701908>**`,
                    components: messageData.components
                });

                await interaction.reply({ content: `**Your ticket has been created:** ${channel}`, ephemeral: true });
            }
            return;
        }
    }
};
