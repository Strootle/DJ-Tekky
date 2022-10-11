const { SlashCommandBuilder, messageLink } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("np").setDescription("Displays the song that is currently playing"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs currently playing.")

    await interaction.editReply(`Currently playing: ${queue.nowPlaying}`);
    },   
}