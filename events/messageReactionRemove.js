const { roles } = require("../config.json");
const colors = require("colors");

module.exports = {
    name: "messageReactionRemove",
    description: "Evenement lorsque qu'un utilisateur enleve ca réaction avec un emoji.",
    
    async execute(client, reaction, user) {
        if (user.bot || reaction.message.channel.id !== "1105550059266920560") return;

        const member = reaction.message.guild.members.cache.get(user.id);

        for (const cat in roles) {
            roles[cat].map(content => {
                let emoji = reaction.emoji;
                let id = content.roleId;

                let roleExist = content.emojiId ? (content.emojiId === emoji.id) : (content.emojiName === emoji.name);
                if (roleExist) {
                    member?.roles.remove(id);
                }
            })
        }
    }
}