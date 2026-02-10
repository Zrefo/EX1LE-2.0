const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const role = member.guild.roles.cache.get(config.autoroleId);
        if (role) await member.roles.add(role).catch(console.error);

        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel) channel.send(`**<@${member.id}> Just joined the server! ✨**`);
    }
};
