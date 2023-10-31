const { tickets } = require("../config")

class Util {
    constructor(client) {
        this.client = client;
    }

    date(timestamp) {
        let date = new Date(timestamp || null);
        return date.toLocaleString();
    }

    /**
     * Vérifier si le salon renseigner dans param.id est dans un array {param.array}
     * @object param {array}
     * @string param {id}
     * @param param.array Tableau a vérifier (obligatoire)
     * @param param.id Id du salon ou autres a renseigner (obligatoire)
     * @returns true si le salon exist dans l'object || false si le salon n'existe pas dans l'object
    */
    isChannel(param) {
        const array = param.array.filter(val => val == param.id);
        return array.length > 0;
    }

    /**
     * Obtenir les propriétés du salon
     *
     * @object param {client} (obligatoire)
     * @string param {key} (falcutatif)
     * @string param {id} (obligatoire)
     * @param param Paramètres pour récuperer le salon depuis le bot
     *
     * @returns si un salon exist alors cela renverra l'object du rôle
    */
    getChannel(param) {
        if (!param.key) return (this.client ? this.client : param.client).channels.cache.get(param.id);
        return (this.client ? this.client : param.client).channels.cache.get(param.id)[param.key];
    }

    /**
     * Obtenir les propriétés de l'utilisateur
     *
     * @object param {client} (obligatoire)
     * @string param {key} (falcutatif)
     * @string param {id} (obligatoire)
     * @param param Paramètres pour récuperer l'utilisateur depuis le bot
     *
     * @returns si un utilisateur exist alors cela renverra l'object de l'utilisateur
    */
    getUser(param) {
        if (!param.key) return (this.client ? this.client : param.client).users.cache.find(user => user.id === param.id);

        return (this.client ? this.client : param.client).users.cache.find(user => user.id === param.id)[param.key];
    }

    user(id) {
        return this.client.users.cache.get(id)
    }

    /**
     * Obtenir les propriétés du rôle
     *
     * @object param {client} (obligatoire)
     * @string param {id} (obligatoire)
     * @param param Paramètres pour récuperer le rôle depuis le bot
     *
     * @returns si un role exist alors cela renverra l'object du rôle
    */
    getRoles(param) {
        return (this.client ? this.client : param.client).guild.roles.cache.get(param.id);
    }

    getInfoTicket(customId) {
        for (let i = 0; i < tickets.length; i++) {
            let item = tickets[i];
            if (customId === item.customId) return item; 
        }

        return false;
    }
}

module.exports = Util;