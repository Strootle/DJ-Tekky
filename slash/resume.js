const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

//Resumes the current track
module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
    run: async ({ client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")
        
        //Unpause and get now playing
        queue.setPaused(false)
        const song = queue.nowPlaying()

        //New Embed
        const embed = new EmbedBuilder()
        embed
            .setTitle(`${song.title}`)
            .setThumbnail(song.thumbnail)
            .setDescription(`Now resuming...`)
    return await interaction.editReply({ embeds: [embed]})
    },
}