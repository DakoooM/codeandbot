
const { Client, Interaction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    description: "Executer les commandes slash",
    
    /** 
        @param {Client} client
        @param {Interaction} interaction
    **/
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                if (command.channels && typeof command.channels === "object" && command.channels.length > 0) {
                    let exist = await client.Utils.isChannel({
                        array: command.channels,
                        id: interaction.channel.id
                    });

                    if (!exist) return await interaction.reply({
                        content: `❌ Veuillez essayer d'éxécuter cette commande dans le${command.channels.length > 1 ? "s" : ""} salon${command.channels.length > 1 ? "s" : ""} → ${command.channels.map(ids => ` <#${ids}>`)} !`,
                        ephemeral: true
                    });
                }

                await command.execute(client, interaction);
            } catch (err) {
                console.error(err);

                await interaction.reply({
                    content: "❌ Il y a eu une erreur lors de la tentative d'execution de cette commande!",
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(client, interaction);
            } catch (err) {
                console.error(err);

                await interaction.reply({
                    content: "❌ Il y a eu une erreur lors de la tentative d'execution de ce button!",
                    ephemeral: true
                });
            }
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return;

            try {
                await modal.execute(client, interaction);
            } catch (err) {
                console.error(err);

                await interaction.reply({
                    content: "❌ Il y a eu une erreur lors de la tentative d'execution de ce modal!",
                    ephemeral: true
                });
            }
        }

    }
}