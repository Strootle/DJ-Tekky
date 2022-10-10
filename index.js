require('dotenv').config()

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent],

	partials: [Partials.Channel]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Registering all messages in discord

client.on('messageCreate', async message => {

	const { commandName } = message;

	console.log (message.content)
});


// Login to Discord with your client's token
client.login(process.env.DISCORD_TOCKEN);

