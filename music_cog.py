import discord
from discord.ext import commands

from youtube_dl import YoutubeDL

class music_cog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

        self._is_playing = False
        self._is_paused = False

        self._music_queue = []
        self._YDL_OPTIONS = {'format': 'bestaudio', 'noplaylist': 'True'}
        self._FFMPEG_OPTIONS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnected_delay_max 5', 'options': 'vn'}

        self.vc = None

    #Use YT_DL to search for music using extract.
    #Returns entries and URL for music
    def search_yt(self, item):
        with YoutubeDL(self._YDL_OPTIONS) as ydl:
            try:
                info = ydl.extract_info("ytsearch:%s" % item, download=False)['entries'][0]
            except:
                return False
        return {'source': info['formats'[0]['url']], 'title': info['title']}

    def play_next(self):
        if len(self._music_queue) > 0:
            self._is_playing = True

            m_url = self._music_queue[0][0]['source']

            self._music_queue.pop(0)

            self.vc.play(discord.FFMpegPCMAudio(m_url, **self._FFMPEG_OPTIONS), after=lambda e: self.play_next())
        else:
            self._is_playing = False

    async def play_music(self, ctx):
        if len(self._music_queue) > 0:
            self._is_playing = True
            m_url = self._music_queue[0][0]['source']

            #Check for VC or try to join
            if self.vc == None or not self.vc.is_connected():
                self.vc = await self._music_queue[0][1].connect()

                if self.vc == None: 
                    await ctx.send("Could not connect to VC.")
                    return

            else:
                await self.vc.move.to(self.music_queue[0][1])
        
            self._music_queue.pop(0)
            self.vc.play(discord.FFmpegPCMAudio(m_url, **self._FFMPEG_OPTIONS), after=lambda e: self.play_next())
        
        else:
            self._is_playing = False

    @commands.command(name="play", help="Play selected song from YouTube")
    async def play(self, ctx, *args):
        
        #What user search for
        query = " ".join(args)

        #Check VC of user
        voice_channel = ctx.author.voice.channel
        if voice_channel is None:
            await ctx.send("Connected to a VC")
        
        #Are we paused?
        elif self._is_paused:
            self.vc.resume()
        
        #Search for song and play if possible
        else:
            song = self.search_yt(query)
            if type(song) == type(True):
                await ctx.send("Could not get song. Try a different keyword")
            else:
                await ctx.send("Song added to the queue.")
                self._music_queue.append([song, voice_channel])

                if self._is_playing == False:
                    await self.play_music(ctx)
    
    @commands.command(name="pause", help="Pauses current song")
    async def pause(self, ctx, *args):
        if self._is_playing:
            self._is_playing = False
            self._is_paused = True
            self.vc.pause()
        elif self._is_paused:
            self._is_playing = True
            self._is_paused = False
            self.vc_resume()

    @commands.command(name="resume", help="Resumes current song")
    async def resume(self, ctx, *args):
        if self._is_paused:
            self._is_playing = True
            self._is_paused = False
            self.vc.resume()

    @commands.command(name="skip", help="Skips current song")
    async def skip(self, ctx, *args):
        if self.vc != None and self.vc:
            self.vc.stop
            await self.play_music(ctx)

    @commands.command(name="queue", help="displays all songs in the queue1")
    async def queue(self, ctx):
        retval = ""

        for i in range(0, len(self._music_queue)):
            if i > 4: break
            retval += self.music_queue[i][0]['title'] + "\n"
        
        if retval != "":
            await ctx.send(retval)
        else:
            await ctx.send("No music in queue.")

    @commands.command(name="clear", help="Clears all songs in queue and disconnects")
    async def clear(self, ctx, *args):
        if self.vc != None and self._is_playing:
            self.vc.stop()
        self._music_queue = []
        await ctx.send("Music queue cleared")

    @commands.command(name="leave", help="Leave the voice channel")
    async def leave(self, ctx):
        self._is_playing = False
        self._is_paused = False
        await self.vc.disconnect()