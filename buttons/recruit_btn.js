const { ChannelType, EmbedBuilder, PermissionFlagsBits, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { Roles, iconURL } = require("../config.json");

module.exports = {
    customId: "recruit_btn",
    
    async execute(client, interaction) {
        const parentInfo = await client.Utils.getInfoTicket(this.customId);

        if (!parentInfo) return await interaction.reply({
            content: "❌ Les informations pour la création ce ticket n'ont pas été trouver, contactez le développeur du bot.",
            ephemeral: true
        })

        let cExist = interaction.guild.channels.cache.find(channels => channels.topic == interaction.user.id);
        if (cExist) return interaction.reply({content: `❌ Vous avez déja un ticket d'ouvert, allez voir ici ${cExist}`, ephemeral: true});

        const permissionsTicket = [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.guild.roles.cache.get(Roles.equipe_staff),
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel]
            },
        ];

        try {
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: interaction.user.id,
                parent: parentInfo.categoryId,
                permissionOverwrites: permissionsTicket
            });
    
            interaction.reply({
                content: `vous avez ouvert le ticket ${channel}`,
                ephemeral: true
            }).then(() => {
                const thumbnailImg = typeof parentInfo.embed.thumbnail === "boolean" ? null : iconURL;

                const embed = new EmbedBuilder();
                embed.setAuthor({name: parentInfo.embed.title});
                embed.setDescription(parentInfo.embed.description);
                parentInfo.embed.fields.map(item => embed.addFields(item));
                embed.setColor(Colors.Purple);
                embed.setImage(parentInfo.embed.image);
                embed.setThumbnail(thumbnailImg);
                embed.setTimestamp();

                const closeBtn = new ButtonBuilder();
                closeBtn.setCustomId("close_ticket");
                closeBtn.setLabel("Cloturer");
                closeBtn.setStyle(ButtonStyle.Danger);

                const buttons = new ActionRowBuilder().addComponents(closeBtn);

                channel.send({
                    content: `${interaction.user} Vous avez ouvert un ticket, veuillez renseigner votre demande.\n<@&${Roles.equipe_staff}> vous répondera dès qu'il seront disponible.`,
                    embeds: [embed],
                    components: [buttons]
                })
            })
        } catch(err) {
            console.error(err);

            await interaction.reply({
                content: "❌ La création du salon a échouez, veuillez contactez le développeur du bot.",
                ephemeral: true
            })
        }
    }
}