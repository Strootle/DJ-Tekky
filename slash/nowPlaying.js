const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("np").setDescription("Displays the song that is currently playing"),
    run: async ({ client, interaction }) => {
        // Get the queue for the server
        const queue = client.player.getQueue(interaction.guildId)

        // Get song playing
        let song = queue.nowPlaying()

        console.log(song)

        // If no song playing
        if(!song) return interaction.editReply("No songs rn playing u idiot .")

        return interaction.editReply(`Name: ${song.title}`)

    },   
}