const { Event } = require('klasa');

const { Client } = require('discord.js');

const SQLite = require("better-sqlite3");
const stats = new SQLite('./db/stats/stats.sqlite');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, { name:'ready', enabled: true });
    }

    run(...params) {
        this.client.channels.cache.get("713005666943500341").send("Startup at **" + getDateTime() + "**");
        this.client.user.setActivity(`you so you don't do anything stupid | e.help`, {
            type: 'WATCHING'
        })
        .then(presence => console.log(`Activity set to watching ${presence.activities[0].name}`))
        .catch(console.error);
    //STATS SQLITE TABLE
    const stat = stats.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'stats';").get();
    if (!stat['count(*)']) {
        stats.prepare("CREATE TABLE stats (id TEXT PRIMARY KEY,user TEXT, guild TEXT, name TEXT, points INTEGER, level INTEGER, gender TEXT, race TEXT, mood TEXT, class TEXT, hp INTEGER, mana INTEGER, stamina INTEGER, rebirth INTEGER, weapon TEXT, healthP INTEGER, manaP INTEGER, staminaP INTEGER, atk INTEGER, def INTEGER, eq1 TEXT, eq2 TEXT, eq3 TEXT, eq4 TEXT, ab1 TEXT, ab2 TEXT, abu TEXT, pet TEXT);").run();
        stats.prepare("CREATE UNIQUE INDEX idx_stats_id ON stats (id);").run();
        stats.pragma("synchronous = 1");
        stats.pragma("journal_mode = wal");
    }
    this.client.getStats = stats.prepare("SELECT * FROM stats WHERE user = ? AND guild = ?");
    this.client.setStats = stats.prepare("INSERT OR REPLACE INTO stats (id, user, guild, name, points, level, gender, race, mood, class, hp, mana, stamina, rebirth, weapon, healthP, manaP, staminaP, atk, def, eq1, eq2, eq3, eq4, ab1, ab2, abu, pet) VALUES (@id, @user, @guild, @name, @points, @level, @gender, @race, @mood, @class, @hp, @mana, @stamina, @rebirth, @weapon, @healthP, @manaP, @staminaP, @atk, @def, @eq1, @eq2, @eq3, @eq4, @ab1, @ab2, @abu, @pet);");
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }

};

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "/" + month + "/" + day + " AT " + hour + ":" + min + ":" + sec;
}