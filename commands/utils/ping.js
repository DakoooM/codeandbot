const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    moderation: false,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("simple testing slash command"),

    async execute(client, interaction) {
        interaction.reply({
            content: "pong",
            ephemeral: true
        });
    }
}