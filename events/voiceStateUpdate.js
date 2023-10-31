require("dotenv/config");

const { PermissionFlagsBits, ChannelType } = require("discord.js");
const { Channels } = require("../Config.json");

module.exports = {
    name: "voiceStateUpdate",
    description: "Lorsqu'un utilisateur change de salon.",
    async execute(client, oldVoice, newVoice) {
        let oldChannel = oldVoice.channel;
        let newChannel = newVoice.channel;
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
        let user = newVoice.guild.members.cache.get(newVoice.id).user || oldChannel.guild.members.cache.get(oldChannel.id).user;

        if (newChannel?.id === Channels.temporaire_creation){ /* salon a se connecter pour crée le salon temporaire */
            const channel = await newChannel.guild.channels.create({
                name: `⏳ ${user.username}`,
                type: ChannelType.GuildVoice,
				parent: Channels.temporaire_creation_category,

				permissionOverwrites: [
                    {
                        id: guild.id, 
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: user.id, 
                        allow: [
                            PermissionFlagsBits.ManageChannels,
                            PermissionFlagsBits.MuteMembers,
                            PermissionFlagsBits.ModerateMembers
                        ]
                    },
                ]
            });

            newVoice?.guild.members.cache.get(newVoice.id).voice.setChannel(channel);
        }

        if (oldChannel?.parentId === Channels.temporaire_creation_category && oldChannel?.id !== Channels.temporaire_creation) {
            if (oldChannel?.members.size <= 0) {
                let oldChannel = oldVoice.channel;

                oldChannel?.delete();
            }
        }
    }
}