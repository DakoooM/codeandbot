const { EmbedBuilder, Colors } = require("discord.js");
const { iconURL, Channels } = require("../config.json");
const hastebin = require("hastebin-gen");

module.exports = {
    customId: "modal_cls_ticket",
    async execute(client, interaction) {
        const reason = interaction.fields.getTextInputValue("reasonInput");
        const other = interaction.fields.getTextInputValue("otherInput");

        const logChannel = client.Utils.getChannel({ id: Channels.ticket_closed_logs });
        const userFind = client.Utils.getUser({ client: client, id: interaction.channel.topic });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            let msgs = messages.filter(msg => !msg.author.bot).map(msg => {
                const author = msg.author;
                const content = msg.attachments.size > 0 ? msg.attachments.first().proxyURL : msg.content;

                return `${client.Utils.date(msg.createdTimestamp)} - ${author.username}#${author.discriminator}: ${content}`;
            });

            msgs = msgs.reverse().join('\n');

            let messages_link = false;

            if (msgs.length > 0) {
                messages_link = await hastebin(msgs, {
                    extension: "diff",
                    url: "https://haste.chaun14.fr/"
                });
            };

            const embed = new EmbedBuilder();
            embed.setAuthor({ name: `Ticket fermer`, url: messages_link ? messages_link : null });
            embed.setColor(Colors.Purple);
            embed.setThumbnail(iconURL);
            embed.setTimestamp();

            embed.addFields(
                { name: "Clôturer par", value: `${interaction.user.tag}\n(${interaction.user.id})`, inline: true },
                { name: "Utilisateur", value: userFind ? `${userFind.tag}\n(${userFind.id})` : "Non Trouvée", inline: true },
                { name: "Raison", value: reason, inline: false },
                { name: "Autres Informations", value: other, inline: false },
                { name: "Messages", value: `${messages_link ? `[Lien externe](${messages_link})` : "Aucun messages"}`, inline: false }
            )

            await interaction.reply({ content: `le ticket va être clôturer dans ${client.ticket_cooldown} secondes` });
            client.ticket_onclosed = true;
            
            const interval = setInterval(async () => {
                client.ticket_cooldown--;

                if (client.ticket_cooldown > 0) {
                    await interaction?.editReply({ content: `le ticket va être clôturer dans ${client?.ticket_cooldown} secondes` });
                } else if (client.ticket_cooldown < 1) {
                    clearInterval(interval);
                    client.ticket_cooldown = 5;
                    client.ticket_onclosed = false;

                    logChannel?.send({
                        content: `${interaction.user} a clôturer le ticket de ${userFind}`,
                        embeds: [embed]
                    });

                    await interaction.channel.delete();
                }
            }, 1 * 1000);
        } catch (err) {
            console.error(err);

            if (client.ticket_onclosed) client.ticket_onclosed = false;
            await interaction.reply({ content: "❌ Les messages ne s'envoi pas correctement, contactez le développeur du bot discord" })
        }
    }
}