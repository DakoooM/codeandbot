const { ActivityType } = require("discord.js");
const { Channels } = require("../config.json");

module.exports = {
    name: "guildMemberAdd",
    description: "Lorsqu'un utilisateur rejoint.",
    
    async execute(client, member) {
        const { guild } = member;

        const welcome_channel = client.Utils.getChannel({id: Channels.discussion_global});

        const welcome_logs_channel = client.Utils.getChannel({id: Channels.join_leave_guild_logs});
        const content = `<:plus_green:1107437794516795432> ${member.user} a rejoint le serveur`;

        const welcome_msg = `Bienvenue ${member.user} sur ${guild.name}\nPrend tes rôles dans le salon <#${Channels.roles_channel}>\nPrésente toi dans le salon <#${Channels.presentation_channels}>`;
        
        welcome_logs_channel?.send({content: content});
        welcome_channel?.send({content: welcome_msg});

        client.user.setPresence({
            activities: [{ name: `${guild.memberCount} membres`, type: ActivityType.Watching }],
            status: "dnd",
        });
    }
}