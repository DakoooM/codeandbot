const {
	Client,
	GatewayIntentBits, 
	Partials, 
	Collection
} = require("discord.js");

const fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv"); /* pour accèder au variables d'environnement dans le fichier .env */
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Util = require("./utils/main");

dotenv.config();

const client = new Client({
	// Please add all intents you need, more detailed information @ https://ziad87.net/intents/
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates
	],

	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction
	]
});

// Client variables environnement
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.ticket_cooldown = 5;
client.ticket_onclosed = false;
client.Utils = new Util(client);

// Loop modals all files and add listener for modals submit
const modalsFolder = fs.readdirSync("./modals").filter((file) => file.endsWith(".js"));;
for (const modalName of modalsFolder) {
	const modal_cmd = require(`./modals/${modalName}`);
	
	if (!modal_cmd.customId) return console.error("modal non chargée (nom pas renseignée) | file: ", modalName);

	client.modals.set(modal_cmd.customId, modal_cmd);

	console.log("[Modal Handler]", colors.bgYellow(modal_cmd.customId), "Loaded!");
}

// Loop through all files and store slash-commands in slashCommands collection.
const slashCommands = fs.readdirSync("./commands");
for (const module of slashCommands) {
	const commandFiles = fs.readdirSync(`./commands/${module}`).filter(file => file.endsWith(".js"));

	for (const cmdFile of commandFiles) {
		const command = require(`./commands/${module}/${cmdFile}`);
		client.commands.set(command.data.name, command);

		console.log("[Command]", colors.bgMagenta(command.data.name), "Loaded!");
	}
}

// Loop events all files and add listener for events
const eventsFolder = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));;
for (const fileName of eventsFolder) {
	const event = require(`./events/${fileName}`);
	
	if (!event.name) return console.error("Evenement non chargée (nom pas renseignée) | file: ", fileName);

	if (!event.once) {
		client.on(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.once(event.name, (...args) => event.execute(client, ...args));
	}

	console.log("[Event]", colors.bgGreen(event.name), " Loaded!");
}

// Loop buttons all files and add listener for buttons click
const buttonsFolder = fs.readdirSync("./buttons").filter((file) => file.endsWith(".js"));;
for (const btnName of buttonsFolder) {
	const button_cmd = require(`./buttons/${btnName}`);
	
	if (!button_cmd.customId) return console.error("button non chargée (nom pas renseignée) | file: ", btnName);

	client.buttons.set(button_cmd.customId, button_cmd);

	console.log("[Button Handler]", colors.bgRed(button_cmd.customId), "Loaded!");
}


// Register all slash (/) commands to bot
const rest = new REST({ version: "9" }).setToken(process.env.APP_TOKEN);
const commandJsonData = [...Array.from(client.commands.values()).map((c) => c.data.toJSON())];

async function RegisterSlashCommands(){
	try {
		// console.log("commandJsonData", commandJsonData);

		await rest.put(
			// for developement mode
			Routes.applicationGuildCommands(process.env.APP_CLIENT_ID, process.env.APP_GUILD_ID),

			// Active after bot developpement
			// Routes.applicationCommands(process.env.APP_CLIENT_ID)

			{ body: commandJsonData }
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
}

RegisterSlashCommands();

client.login(process.env.APP_TOKEN);