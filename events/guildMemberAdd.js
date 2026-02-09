const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // Dodanie roli
        const role = member.guild.roles.cache.get(config.autoroleId);
        if (role) await member.roles.add(role);

        // Wysłanie wiadomości
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel) {
            channel.send(`**<@${member.id}> Just joined the server! ✨**`);
        }
    }
};
