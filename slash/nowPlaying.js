// const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

// module.exports = {
//     data: new SlashCommandBuilder().setName("np").setDescription("Displays the song that is currently playing"),
//     run: async ({ client, interaction }) => {
//         const queue = client.player.getQueue(interaction.guildId)

//         if (!queue) return await interaction.editReply("There are no songs currently playing.")
//         let nowPlaying = new EmbedBuilder()
//     await interaction.editReply(`Currently playing: ${queue.nowPlaying.data}`),
//     console.log(queue.nowPlaying.data)
//     },   
// }