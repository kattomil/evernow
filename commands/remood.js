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
            name: 'remood',
            enabled: true,
            runIn: ['text'],
            cooldown: 60,
            aliases: [],
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
        this.client.getStats = stats.prepare("SELECT * FROM stats WHERE user = ? AND guild = ?");
        this.client.setStats = stats.prepare("INSERT OR REPLACE INTO stats (id, user, guild, name, points, level, gender, race, mood, class, hp, mana, stamina, rebirth, weapon, healthP, manaP, staminaP, atk, def, eq1, eq2, eq3, eq4, ab1, ab2, abu, pet) VALUES (@id, @user, @guild, @name, @points, @level, @gender, @race, @mood, @class, @hp, @mana, @stamina, @rebirth, @weapon, @healthP, @manaP, @staminaP, @atk, @def, @eq1, @eq2, @eq3, @eq4, @ab1, @ab2, @abu, @pet);");
        let stat = this.client.getStats.get(msg.author.id, pi);
        if (!stat) return msg.channel.send(`**Sorry but you do not have a profile. Create one with the \`${pref}profile\` command**`)
        const filter2 = (reaction, user) => {
            return ['😄', '😭', '🤪', '😠'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };
        msg.channel.send("**Choose your character's mood\n😄 (happy) / 😭 (sad) / 🤪 (crazy) / 😠 (angry)**").then(async message => {
            await message.react('😄').catch(() => console.error('One of the emojis failed to react.'));
            await message.react('😭').catch(() => console.error('One of the emojis failed to react.'));
            await message.react('🤪').catch(() => console.error('One of the emojis failed to react.'));
            await message.react('😠').catch(() => console.error('One of the emojis failed to react.'));

            message.awaitReactions(filter2, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                .then(collected => {
                    const reaction = collected.first();
                    switch (reaction.emoji.name) {
                        case '😄':
                            stat.mood = "Happy";
                            message.edit("Your character's **mood** is now **happy**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                        case '😭':
                            stat.mood = "Sad";
                            message.edit("Your character's **mood** is now **sad**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                        case '🤪':
                            stat.mood = "Crazy";
                            message.edit("Your character's **mood** is now **crazy**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                        case '😠':
                            stat.mood = "Angry";
                            message.edit("Your character's **mood** is now **angry**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                    }
                }).then(() => this.client.setStats.run(stat));
        })
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }

};