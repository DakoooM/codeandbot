const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { roles } = require("../../config.json");

const compactEmojis = (key) => {
    let emojis = {};

    for (const cat in roles) {
        let category = roles[cat];

        if (!emojis[cat]) emojis[cat] = [];

        for (let i = 0; i < category.length; i++){
            let item = category[i];
            let emojiIns = item.emojiId ? `<:${item.emojiName}:${item.emojiId}>` : item.emojiName;

            emojis[cat].push(emojiIns);
        }
    }

    return key ? emojis[key] : emojis;
}

module.exports = {
    channels: ["1106747808675012751", "1105550059266920560"],
    moderation: true,
    data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Ajouter le message pour que les utilisateur puissent prendre leur rôles")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(client, interaction) {
        for (const cat in roles) {
            let emojiCatList = compactEmojis(cat);
            let innerCat = `**__${cat}__:**\n\n`;

            await roles[cat].map(item => {
                let emjFrmtd = item.emojiId ? `<:${item.emojiName}:${item.emojiId}>` : item.emojiName;
                innerCat += `${emjFrmtd} <@&${item.roleId}>\n`;
            });

            const message = await interaction.channel.send({content: innerCat});
            emojiCatList.forEach(emj => message.react(emj));
        }

        interaction.reply({
            content: "Vous avez mis le message des rôles",
            ephemeral: true
        })
    }
}