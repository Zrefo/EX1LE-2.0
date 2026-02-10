const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('Rejestracja komend...');
        await rest.put(
            Routes.applicationCommands('1268704004863430657'),
            { body: commands }
        );
        console.log('Komendy zarejestrowane!');
    } catch (error) {
        console.error(error);
    }
})();
