const { EmbedBuilder, SlashCommandBuilder, Colors } = require("discord.js");
const { iconURL, bannerURL } = require("../../config.json");

module.exports = {
    moderation: false,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all commands of bot or info about a specific command.")
        .addBooleanOption(option =>
            option.setName("ephemeral")
                .setDescription("Si les commandes doivent apparaitre seulement pour vous")
                .setRequired(false)
        ),

    async execute(client, interaction) {
        const ephemeral = interaction.options.getBoolean("ephemeral") ?? true;

        const embed = new EmbedBuilder();
        embed.setTitle("Liste des commande slash");
        embed.setColor(Colors.Purple);
        embed.setThumbnail(iconURL);
        embed.setImage(bannerURL.help);
        embed.setTimestamp();

        client.commands.map(command => {
            if (command.data.name !== interaction.commandName) {
                const data = command.data;
                const channels = command.channels;

                embed.addFields({
                    name: `/${data.name} ${command.moderation ? "<:role_guide:1107401413006471238>" : "@everyone"}`,
                    value: `${channels ? (channels.map(id => `<#${id}>`) + "\n") : ""}${data.description}`,
                    inline: false
                });
            }
        })


        interaction.reply({
            embeds: [embed],
            ephemeral: ephemeral
        });
    }
}