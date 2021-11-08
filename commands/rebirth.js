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
            name: 'rebirth',
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
        if (!stat) return msg.channel.send(`**Sorry but you do not have a profile. Create one with the \`${pref}profile\` command**`);
        var prof = [];
        const filter1 = (reaction, user) => {
            return ['♂️', '♀️'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };
        msg.channel.send("**Choose your character's gender\n♂ (male) / ♀️ (female)**").then(async message => {
            await message.react('♂️').catch(() => console.error('One of the emojis failed to react.'));
            await message.react('♀️').catch(() => console.error('One of the emojis failed to react.'));

            message.awaitReactions(filter1, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                .then(collected => {
                    const reaction = collected.first();
                    switch (reaction.emoji.name) {
                        case '♂️':
                            prof.push("Male");
                            message.edit("Your character's **gender** is now **male**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                        case '♀️':
                            prof.push("Female");
                            message.edit("Your character's **gender** is now **female**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                            break;
                    }
                }).then(() => {
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
                                        prof.push("Happy");
                                        message.edit("Your character's **mood** is now **happy**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                        break;
                                    case '😭':
                                        prof.push("Sad");
                                        message.edit("Your character's **mood** is now **sad**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                        break;
                                    case '🤪':
                                        prof.push("Crazy");
                                        message.edit("Your character's **mood** is now **crazy**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                        break;
                                    case '😠':
                                        prof.push("Angry");
                                        message.edit("Your character's **mood** is now **angry**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                        break;
                                }
                            }).then(() => {

                                const filter3 = (reaction, user) => {
                                    return ['🏹', '⚔️', '🗡️', '🗝️'].includes(reaction.emoji.name) && user.id === msg.author.id;
                                };
                                msg.channel.send("**Choose your character's class\n🏹 (Archer) / ⚔️ (Knight) / 🗡️ (Thief) / 🗝️ (Wizard)**").then(async message => {
                                    await message.react('🏹').catch(() => console.error('One of the emojis failed to react.'));
                                    await message.react('⚔️').catch(() => console.error('One of the emojis failed to react.'));
                                    await message.react('🗡️').catch(() => console.error('One of the emojis failed to react.'));
                                    await message.react('🗝️').catch(() => console.error('One of the emojis failed to react.'));

                                    message.awaitReactions(filter3, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                        .then(collected => {
                                            const reaction = collected.first();
                                            switch (reaction.emoji.name) {
                                                case '🏹':
                                                    prof.push("Archer");
                                                    message.edit("Your character's **class** is now an **archer**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                                    break;
                                                case '⚔️':
                                                    prof.push("Knight");
                                                    message.edit("Your character's **class** is now a **knight**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                                    break;
                                                case '🗡️':
                                                    prof.push("Thief");
                                                    message.edit("Your character's **class** is now a **thief**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                                    break;
                                                case '🗝️':
                                                    prof.push("Wizard");
                                                    message.edit("Your character's **class** is now a **wizard**.").then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                                                    break;
                                            }
                                        }).then(() => {
                                            if (prof.length < 3) return;
                                            stat = {
                                                id: `${msg.author.id}-${pi}`,
                                                user: msg.author.id,
                                                guild: pi,
                                                name: msg.author.username,
                                                points: 0,
                                                level: 1,
                                                gender: prof[0],
                                                race: 'Human',
                                                mood: prof[1],
                                                class: prof[2],
                                                hp: 100,
                                                mana: 100,
                                                stamina: 100,
                                                rebirth: stat.rebirth + 1
                                            };
                                            this.client.setStats.run(stat);
                                            var images = ["src/profile/profile.png", `src/race/${stat.race}/${stat.gender}/${stat.class}.png`];
                                            var jimps = [];
                                            for (var i = 0; i < images.length; i++) {
                                                jimps.push(jimp.read(images[i]));
                                            }
                                            Promise.all(jimps).then(function(data) {
                                                return Promise.all(jimps);
                                            }).then(function(data) {
                                                data[0].composite(data[1], 307, 483)
                                                jimp.loadFont("src/fonts/RomanticChicago/RomanticChicago.fnt").then(font => {
                                                    /// +140
                                                    data[0].print(font, 430, 1640, `${stat.class}`)
                                                        .print(font, 375, 260, `Race: ${stat.race}`)
                                                        .print(font, 1100, 225, `ATK: 0`)
                                                        .print(font, 1100, 365, `DEF: 0`)
                                                        .print(font, 1100, 505, `HP: ${stat.hp}`)
                                                        .print(font, 1100, 645, `Mana: ${stat.mana}`)
                                                        .print(font, 1100, 785, `Stamina: ${stat.stamina}`)
                                                        .print(font, 1100, 925, `Mood: ${stat.mood}`)
                                                        .print(font, 1100, 1065, `Abilities:`)
                                                        .print(font, 1100, 1550, `Items:`)
                                                        .write("Profiles/" + msg.author.username + '.png');
                                                })
                                            })
                                            msg.channel.send("**Creating profile...**").then(m => {
                                                setTimeout(() => {
                                                    m.delete().then(() => msg.channel.send(`**${msg.author.username}** has been rebirthed into...`, new Discord.MessageAttachment("Profiles/" + msg.author.username + ".png"))).then(() => {
                                                        setTimeout(() => {
                                                            fs.unlinkSync("Profiles/" + msg.author.username + '.png');
                                                        }, 5000);
                                                    })
                                                }, 5000)
                                            })
                                        })
                                })
                            })
                    })
                })
        })
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }

};