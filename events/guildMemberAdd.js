module.exports = {
    name: 'guildMemberAdd',
    once: false, // będzie wywoływany przy każdym nowym członku
    async execute(member, client) {
        try {
            // --- Dodanie roli ---
            const roleId = '1118541829797847201';
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                await member.roles.add(role);
            } else {
                console.log(`Nie znaleziono roli o ID: ${roleId}`);
            }

            // --- Wysłanie wiadomości ---
            const channelId = '1088911451701391412';
            const channel = member.guild.channels.cache.get(channelId);
            if (channel && channel.isText()) {
                channel.send(`${member} Just joined the server! ✨`);
            } else {
                console.log(`Nie znaleziono kanału o ID: ${channelId}`);
            }
        } catch (error) {
            console.error('Błąd w guildMemberAdd:', error);
        }
    }
};
