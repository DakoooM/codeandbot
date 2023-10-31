const { TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const { Roles, iconURL } = require("../config.json");

module.exports = {
    customId: "close_ticket",
    async execute(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (!interaction.member.roles.cache.has(Roles.equipe_staff)) return await interaction.reply({
                content: "❌ Vous n'avez pas les permissions de fermer le ticket.",
                ephemeral: true
            })
        }

        if (client.ticket_onclosed) return await interaction.reply({ 
            content: `❌ veuillez attendre ${client.ticket_cooldown} secondes avant de cloturer ce ticket`, 
            ephemeral: true 
        });

        const modal = new ModalBuilder().setCustomId("modal_cls_ticket").setTitle("Clôturer le Ticket");

        const reasonInput = new TextInputBuilder()
            .setCustomId("reasonInput")
            .setLabel("Raison de la fermeture du ticket")
            .setMinLength(4)
            .setMaxLength(50)
            .setValue("Aucune")
            .setPlaceholder("Si il n'y a aucune raison alors ne mettez rien.")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const otherInput = new TextInputBuilder()
            .setCustomId("otherInput")
            .setLabel("Autres informations")
            .setMinLength(4)
            .setMaxLength(100)
            .setValue("Aucune")
            .setPlaceholder("Informations que vous souhaitez préciser par rapport au ticket. (manque de respect...)")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
        const secondActionRow = new ActionRowBuilder().addComponents(otherInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}