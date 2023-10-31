require("dotenv/config");

const { ActivityType } = require("discord.js");
const colors = require("colors");

module.exports = {
    name: "ready",
    description: "Evenement lorsque le bot est chargée.",

    async execute(client) {
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
        
        client.user.setPresence({
            activities: [{ name: `${guild.memberCount} membres`, type: ActivityType.Watching }],
            status: "dnd",
        });
        
        console.log(colors.green(`${client.user.tag} is ready to use to ${guild.name}!`));
    }
}