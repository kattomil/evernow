const { Command } = require('klasa');
const SQLite = require("better-sqlite3");
const stats = new SQLite('./db/stats/stats.sqlite');
const pi = "314159265358979323";
const jimp = require('jimp');
const Discord = require("discord.js");
const fs = require('fs');
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'leaderboard',
            enabled: true,
            runIn: ['text'],
            cooldown: 60,
            aliases: ["lb"],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: '',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...params]) {
        const top10 = stats.prepare("SELECT * FROM stats WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(pi);
        const embed = new Discord.MessageEmbed()
            .setTitle("Evernow Leaderboard")
            .setColor(0x00AE86);
        for (const data of top10) {
            embed.addField(`${data.class} ${this.client.users.cache.get(data.user).username}`, `Level ${data.level} (${data.points}), ${data.race}, ${data.gender}`);
        }
        return msg.channel.send({
            embed
        });
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }

};