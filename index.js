const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

fs.readdirSync("./events").forEach(file => {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
});

fs.readdirSync("./commands").forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

client.login(config.token);
