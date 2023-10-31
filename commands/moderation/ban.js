const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors } = require("discord.js");
const { Channels, iconURL } = require("../../config.json");

module.exports = {
    moderation: true,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Effacer le nombre de messages que vous souhaitez")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName("member")
                .setDescription("membre a bannir définitivement du serveur discord")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Raison du bannissement")
                .setRequired(false)
        ),

    async execute(client, interaction) {
        const target = interaction.options.getUser("member");
        const reason = (interaction.options.getString("reason") ?? "Aucune raison défini") + " (bot_codeandchill)";

        if (!target) return await interaction.reply({ content: "Aucun utilisateur trouvée!", ephemeral: true });

        const banLogsChannel = client.Utils.getChannel({ id: Channels.ban_unban_logs });
        if (!banLogsChannel) return await interaction.reply({ content: "Le salon de logs de ban n'existe pas, contactez le développer!", ephemeral: true });

        try {
            await interaction.guild.members.ban(target, { reason });

            await interaction.reply({
                content: `Vous avez banni ${target.username} pour la raison: ${reason}`,
                ephemeral: true
            });

            const embedLog = new EmbedBuilder();
            embedLog.setAuthor({ name: `Bannissement de ${target.username}` });
            embedLog.addFields(
                { name: "Utilisateur banni", value: target.username, inline: false },
                { name: "Banni par", value: interaction.user.username, inline: false },
                { name: "Raison du ban", value: reason, inline: false }
            );

            embedLog.setColor(Colors.Purple);
            embedLog.setThumbnail(iconURL);
            embedLog.setTimestamp();

            banLogsChannel.send({ content: `L'utilisateur ${target} a été banni par ${interaction.user}`, embeds: [embedLog] });
        } catch (err) {
            await interaction.reply({
                content: "Une erreur est survenue lors du bannissement!",
                ephemeral: true
            });
        }
    }
}