const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song to the next song in queue"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs currently playing to be skipped. \nGet some tunes on mate.")

        queue.skip()
    await interaction.editReply("Song skipped, best hope that wasn't a good tune.")
    },
}