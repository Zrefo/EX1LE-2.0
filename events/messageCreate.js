const { addXP } = require("../utils/levels");

module.exports = {
  name: "messageCreate",
  execute(message, client) {
    if (message.author.bot) return;

    addXP(message.author.id);

    if (!message.content.startsWith("/")) return;

    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);
    if (command) command.execute(message, args);
  }
};
