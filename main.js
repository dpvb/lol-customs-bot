const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// Register .ENV file
const dotenv = require('dotenv');
dotenv.config();

// Create a Client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Setup Command Listening
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing required "data" or "execute" properties.`);
	}
}

// Setup Event Listening
const eventsPath = path.join(__dirname, 'events');
const eventFile = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFile) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login
client.login(process.env.DISCORD_TOKEN);