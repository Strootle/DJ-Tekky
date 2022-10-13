const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")


//Pauses the current track
module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
    run: async ({ client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        const embed = new EmbedBuilder()
        embed
            .setDescription("Music has been paused! Use '/resume' to contine the music")
            .setFooter({text: "DJ Tekky"})
            .setTimestamp()
        queue.setPaused(true)
    return await interaction.editReply({ embeds: [embed]})
    },  
}