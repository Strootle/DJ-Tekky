module.exports = {
    clearQueue: (queue) => {
        if (this.destroyed)
        throw new DMPError(DMPErrors.QUEUE_DESTROYED);

        let currentlyPlaying = this.songs.shift();
        this.songs = currentlyPlaying;
    },
    // Get avatar for user
    getAvatar: (requester) => {
        if (!requester.avatar) return `https://cdn.discordapp.com/embed/avatars/0.jpeg` // Default
        return `https://cdn.discordapp.com/avatars/${requester.id}/${requester.avatar}.jpeg`
    },

    // Format the number of views into something readable
    // For example 1000000 -> 1M
    viewsFormatter: (views) => {
        const formatter = Intl.NumberFormat('en', { notation: 'compact' })
        return formatter.format(views)
    },

    // Identify the source of the song,
    // from the url
    identifySource: (song) => {
        if(song.url.includes("youtube.com")) {
            return {
                name: "YouTube",
                logo: "https://www.icsdevon.co.uk/wp-content/uploads/2021/09/YouTube-logo-1536x1536.png"
            }
        } else {
            return {
                name: "Spotify",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
            }
        }
    }
}