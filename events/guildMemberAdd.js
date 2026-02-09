const config = require("../config.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const role = member.guild.roles.cache.get(config.autoRole);
    if (role) await member.roles.add(role);

    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!channel) return;

    channel.send({
      content: `**${member} Just joined the server! ✨**`
    });
  }
};
