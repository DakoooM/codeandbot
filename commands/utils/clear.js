const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    moderation: true,
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Effacer le nombre de messages que vous souhaitez")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption(option => 
        option.setName("number_messages")
        .setDescription("Le nombre de message a éffacé!")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

    async execute(client, interaction) {
        const number = interaction.options.getNumber("number_messages");

        interaction.channel.bulkDelete(number, true).then(() => {
            interaction.reply({content: `Vous avez supprimé ${number} message${number > 1 ? "s" : ""}`, ephemeral: true});
        });
    }
}