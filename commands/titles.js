const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('titles')
        .setDescription('Shows all level titles'),

    async execute(interaction) {
        
        const embed = new EmbedBuilder()
            .setColor('#7CFC00') 
            .setTitle('TITLES:')
            .setDescription(
`<@&1159525114057064599> **- LEVEL 100**
<@&1159523561669660743> **- LEVEL 90**
<@&1159523558754627666> **- LEVEL 80**
<@&1159523551422992384> **- LEVEL 70**
<@&1116475290823180308> **- LEVEL 60**
<@&1116474044288614410> **- LEVEL 50**
<@&1116458140397994066> **- LEVEL 40**
<@&1116457544974602341> **- LEVEL 30**
<@&1116457498073903246> **- LEVEL 20**
<@&1116457277709373551> **- LEVEL 10**

**Every time you achieve a new title there will be a message on a special channel: <#1400263230059708416>** 🎉`
            );

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
