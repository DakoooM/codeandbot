const { ActivityType } = require("discord.js");
const { Channels } = require("../config.json");

module.exports = {
    name: "guildMemberRemove",
    description: "Lorsqu'un utilisateur quiite.",
    
    async execute(client, member) {
        const { guild } = member;

        const welcome_logs_channel = client.Utils.getChannel({id: Channels.join_leave_guild_logs});
        const content = `<:moins_red:1107438081054871613> ${member.user} a quitter le serveur`;
        
        welcome_logs_channel?.send({content: content});

        client.user.setPresence({
            activities: [{ name: `${guild.memberCount} membres`, type: ActivityType.Watching }],
            status: "dnd",
        });
    }
}