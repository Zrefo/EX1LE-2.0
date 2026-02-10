const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Tworzymy klienta z odpowiednimi intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,             // dostęp do serwerów
        GatewayIntentBits.GuildMembers,       // dostęp do członków (autorole, powitania)
        GatewayIntentBits.GuildMessages,      // dostęp do wiadomości
        GatewayIntentBits.MessageContent      // treść wiadomości (do XP)
    ]
});

// Kolekcja komend
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Eventy - messageCreate i guildMemberAdd + interactionCreate
const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Logowanie bota i ustawienie statusu
client.once('ready', async () => {
    console.log(`${client.user.tag} jest online!`);

    const updateStatus = async () => {
        let totalMembersWithRole = 0;

        // Iteracja po wszystkich serwerach bota
        for (const guild of client.guilds.cache.values()) {
            const role = guild.roles.cache.get('1079360096338976828');
            if (!role) continue;

            // Fetch wszystkich członków, aby mieć pełny cache
            await guild.members.fetch();

            // Zlicz członków z rolą
            totalMembersWithRole += guild.members.cache.filter(member => member.roles.cache.has(role.id)).size;
        }

        // Ustaw status bota
        client.user.setPresence({
            activities: [{
                name: `With ${totalMembersWithRole} mates ✨`,
                type: 0 // Playing
            }],
            status: 'online'
        });
    };

    // Aktualizacja od razu
    await updateStatus();

    // Odświeżanie co 60 sekund
    setInterval(updateStatus, 60 * 1000);
});

// Logowanie bota
client.login(config.token);
