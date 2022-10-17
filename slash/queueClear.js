const { SlashCommandBuilder, EmbedBuilder, embedLength } = require("@discordjs/builders")
const { IntegrationApplication } = require("discord.js")
const { getAvatar, clearQueue } = require("../funcs")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue-clear")
    .setDescription("Clears the queue of queued songs"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        const empty = new EmbedBuilder()
        empty
            .setDescription("There is nothing in the queue atm.")
        
        if (!queue) return await interaction.editReply({embeds: [empty]})
        
        //Loops to clear the queue
        while (queue.tracks.length != 0){
            queue.tracks.pop()
        }
        //console.log(queue)

        //Making an embed for clearing the queue
        const embed = new EmbedBuilder()
        embed
            .setAuthor({name: `Executed By ${interaction.user.username}`, iconURL: getAvatar(interaction.user)})
            .setDescription("Queue has been cleared.")
            .setFooter({text: "DJ Tekky"})
            .setTimestamp()
        return await interaction.editReply({embeds: [embed]})
        },
 }
