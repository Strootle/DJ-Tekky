const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("np").setDescription("Displays the song that is currently playing"),
    run: async ({ client, interaction }) => {
        // Get the queue for the server
        const queue = client.player.getQueue(interaction.guildId)

        // If no queue
        if(!queue) return await interaction.editReply({ content: "No queue of songs", ephemeral: true })

        // Get song playing
        const song = queue.nowPlaying()

        // If no song playing
        if(!song) return await interaction.editReply({ content: "No songs are playing rn u idiot", ephemeral: true })

        // Build new embed
        const embed = new EmbedBuilder()
        embed
            // Song title & description
            .setTitle(`🎵 ${song.title}`)
            .setDescription('Now Playing')
            // Show requester
            .setAuthor({ name: `Queued by ${song.requestedBy.username}`, iconURL: song.requestedBy.avatar.iconURL || 'https://cdn.discordapp.com/embed/avatars/0.png' })
            // Add fields
            .addFields({ name: 'Artist', value: song.author, inline: true })
            .addFields({ name: 'Duration', value: song.duration, inline: true })
            .addFields({ name: 'Views', value: `${viewsFormatter(song.views)}`, inline: true })
            // Add thumbnail
            .setImage(song.thumbnail)
            // Show footer
            .setFooter({ text: `DJ Tekky` })
            .setTimestamp()

        // Reply with embed
        return await interaction.editReply({ embeds: [embed] })
    },   
}

// Format the number of views into something readable
// For example 1000000 -> 1M
function viewsFormatter(views) {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(views)
}