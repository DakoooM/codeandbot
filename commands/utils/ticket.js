require("dotenv/config");

const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    Colors, 
    EmbedBuilder, 
    ButtonBuilder,
    Client,
    Interaction,
    ButtonStyle, 
    PermissionFlagsBits 
} = require("discord.js");

const { 
    tickets, 
    ticket_embed_fields, 
    iconURL, 
    iconURL_transparent,
    websiteURL,
    bannerURL
} = require("../../config.json");

module.exports = {
    moderation: true,
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Ajouter le message pour que les utilisateur puissent ouvrir des tickets")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /** 
        @param {Client} client
        @param {Interaction} interaction
    **/
    async execute(client, interaction) {
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);

        const buttonsClient = [];

        tickets.forEach(item => {
            const button = new ButtonBuilder();

            button.setCustomId(item.customId);
            button.setEmoji(item.emoji);
            button.setLabel(item.label);
            button.setStyle(ButtonStyle[item.style]);

            buttonsClient.push(button);
        })

        const buttons = new ActionRowBuilder().addComponents(buttonsClient);

        const embed = new EmbedBuilder();
        embed.setAuthor({ name: client.user.username, iconURL: iconURL_transparent, url: websiteURL });
        embed.addFields(ticket_embed_fields);
        embed.setColor(Colors.Purple);
        embed.setThumbnail(iconURL);
        embed.setImage(bannerURL.ticket);
        embed.setTimestamp();

        tickets.map(item => {
            embed.addFields({ name: `${item.emoji} ${item.label}`, value: item.description, inline: item.inline });
        })

        const msg = await interaction.channel.send({
            embeds: [embed],
            components: [buttons]
        })

        await interaction.reply({
            content: `le message https://discord.com/channels/${guild.id}/${interaction.channel.id}/${msg.id} a été mis a jour`,
            ephemeral: true
        })
    }
}