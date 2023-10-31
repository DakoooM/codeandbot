const { Client, Message } = require("discord.js");

module.exports = {
    name: "messageCreate",
    description: "Lorsqu'un joueur rejoint.",

    /** 
    *
    * @param {Client} client
    * @param {Message} message
    *
    **/
    async execute(client, message) {
        if (message.author.bot) return;

        console.log("messageCreate", message.content);
    }
}