module.exports = {
    name: 'ping',
    description: 'Sprawdza opóźnienie bota',
    async execute(interaction) {
        // Sprawdzenie opóźnienia bota
        await interaction.reply(`Pong! 🏓 Latency: ${Date.now() - interaction.createdTimestamp}ms`);
    }
};
