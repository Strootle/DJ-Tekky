const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

//Adding play slash commands
module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("loads songs from youtube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song-url")
				.setDescription("Loads a single song from a url")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("youtube-playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for song based on provided keywords")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("the search keywords.").setRequired(true))
		)
        .addSubcommand((subcommand) => 
            subcommand
                .setName("spotify-playlist")
                .setDescription("Searches for a spotify playlist via url")
                .addStringOption((option) => 
                    option.setName("spotifypl").setDescription("searches for spoify playlist via URL").setRequired(true))
        ),
    //When running, checks for the activation of slash commands
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder();

		if (interaction.options.getSubcommand() === "song-url") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                .setTimestamp()

		} else if (interaction.options.getSubcommand() === "youtube-playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: "DJ Tekky"})
                .setTimestamp()

		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                .setTimestamp()

		} else if (interaction.options.getSubcommand() === "spotify-playlist"){
            let url = interaction.options.getString("spotifypl")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const spotifyplaylist = result.playlist
            //console.log(result) Gets Playlist Info
            //console.log(spotifyplaylist.title)
            await queue.addTracks(result.tracks)
            embed
                //Add author
                .setAuthor({ name: `Queued by ${song.requestedBy.username}`, iconURL: song.requestedBy.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png' })
                //Adds title
                .setTitle(`Playlist: ${spotifyplaylist.title}`)
                //Adds Description
                .setDescription(`Spotify playlist is now added to queue. Added by: ${interaction.user}`)
                //Adds field
                .addFields({name: `Total Songs`, value: `${spotifyplaylist.tracks.length}`, inline: true})
                .addFields({name: `Author`, value: `${spotifyplaylist.author.name}`, inline: true})
                .setImage(spotifyplaylist.thumbnail)
                .setFooter({text: "DJ Tekky"})
                .setTimestamp()

        }

        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}