const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
client.prefix = prefix;

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    fs.readdirSync(commandsPath).forEach(file => {
        if (file.endsWith('.js')) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        }
    });
}

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    fs.readdirSync(eventsPath).forEach(file => {
        if (file.endsWith('.js')) {
            const event = require(`./events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    });
}

client.once('ready', async () => {
    console.log(`Bot zalogowany jako ${client.user.tag}!`);

    const slashCommands = client.commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description
    }));

    const rest = new REST({ version: '9' }).setToken(token);
    try {
        console.log('Rejestracja slash komend...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommands }
        );
        console.log('Slash komendy zarejestrowane!');
    } catch (error) {
        console.error('Błąd podczas rejestracji slash komend:', error);
    }
});

client.login(token);
