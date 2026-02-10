const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,             
        GatewayIntentBits.GuildMembers,       
        GatewayIntentBits.GuildMessages,      
        GatewayIntentBits.MessageContent      
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.once('ready', async () => {
    console.log(`${client.user.tag} jest online!`);

    const updateStatus = async () => {
        let totalMembersWithRole = 0;

        for (const guild of client.guilds.cache.values()) {
            const role = guild.roles.cache.get('1079360096338976828');
            if (!role) continue;

            await guild.members.fetch();

            totalMembersWithRole += guild.members.cache.filter(member => member.roles.cache.has(role.id)).size;
        }

        client.user.setPresence({
            activities: [{
                name: `With ${totalMembersWithRole} mates ✨`,
                type: 0
            }],
            status: 'online'
        });
    };

    await updateStatus();

    setInterval(updateStatus, 60 * 1000);
});

client.login(config.token);
