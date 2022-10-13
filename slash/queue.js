const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { IntegrationApplication } = require("discord.js")


//When new song is added after one is already playing
module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display current song on the queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("There are no songs in the queue")
        }

        const totPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1 ) - 1

        if (page > totPages) 
            return await interaction.editReply(`Invalid Page. There are only a total of ${totPages} pages of songs`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentTrack = queue.current

        const embed = new EmbedBuilder()
        embed
            .setDescription("**Currently Playing**\n" +
            (currentTrack ? `\`[${currentTrack.duration}]\` ${currentTrack.title} -- <@${currentTrack.requestedBy.id}>` : "None") +
            `\n\n**Queue**\n${queueString}`
            )
            .setFooter({
                text: `Page ${page + 1} of ${totPages}`
            })
            .setThumbnail(currentTrack.thumbnail)
        await interaction.editReply({ embeds: [embed]})
    }
}
