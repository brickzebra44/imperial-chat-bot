const mineflayer = require('mineflayer')
const bot = require('fs');


var keyword = "!";
var delaySpam = 1600;
var messages = ["Imperials own this server.", "> Hail the Imperial Empire", "Imperial are always right", "Join the Imperials or be a normie", "Imperials on /ftop", "All groups are controled by the Imperials"]
var justSpam = false;

if (process.argv.length < 4 || process.argv.length > 7) {
    console.log('Usage : node echo.js <host> [<name>] [<password>]')
    process.exit(1)
}

if (process.argv[5] == "true") {
    delaySpam = 8000;
    justSpam = true;
    spamming = true;
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: 25565, // optional
    username: process.argv[3] ? process.argv[3] : 'echo',
    password: process.argv[4],
    verbose: true,
    version: "1.12.2", // online-mode=true servers
})

var counter = 0;
var spamming = false;
var keyWordOnce = false;

var moveinterval = 2; // 2 second movement interval
var maxrandom = 5; // 0-5 seconds added to movement interval (randomly)

// DISCORD
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('NTE3MDY5MDk0MzQ0OTgyNTQ4.W_2kHg.Gkkt9jTjf-j9f_y9Vg2nTaX6CKg');

client.on('message', msg => {
    if (msg.author.id != client.user.id)
        if (msg.channel.name == process.argv[2].split(".")[0])
            bot.chat("[" + msg.author.tag + "]" + ": " + msg.content);
        else if (msg.channel.name == "anarchy-bar" && process.argv[2] == "anarchy.bar") {
        bot.chat(msg.author.username + ": " + msg.content);
    } else if (msg.channel.name == "announcements") {
        bot.chat(">[ANNOUNCEMENT]: " + msg.content);
    }
});

client.login('xyz');

// BOT ON FIRST LOGIN
bot.on('login', function() {
    keyWordOnce = true;
    if (!spamming) {
        // sleep(1000);
        // bot.chat("brickzebra is online, type ~help for commands. For the chat
        // bridge join https://discord.gg/HN34NCP");
    }

    var embed1 = new Discord.RichEmbed();
    embed1.setAuthor("brickzebra", "https://minotar.net/avatar/brickzebra");
    embed1.setDescription("brickzebra is now online. Type in the channel to communicate with the server.");
    sendDiscordBotMessage(embed1);

    setInterval(function() {
        if (counter >= messages.length) {
            counter = 0;
        }
        
        let msg = messages[counter];
        
        if (spamming) {
            bot.chat(">" + (Math.floor(Math.random() * 10000)).toString() + " - " + msg);
        }
        
        counter++;

    }, delaySpam);
});

// BOT CHAT HANDLING
bot.on('chat', function(username, message) {
    console.log(username + ": " + message);

    if (username != "brickzebra") {
        var embed1 = new Discord.RichEmbed();
        
        embed1.setAuthor(username, "https://minotar.net/avatar/" + username);
        embed1.setDescription(message);
        getDiscordChannel(process.argv[2]).send(embed1);
    }

    if (username === bot.username) return;

    if (message == "~LEAVE" && username == "brickzebra") {
        bot.leave();
    } else if (message.toLowerCase() == "~toggle spam" && username == "brickzebra") {
        spamming = !spamming;
    } else if (message.toLowerCase() == "~help") {
        bot.chat("~help, ~bal, ~pay, ~kill, ~ez, ~properganda, ~ftop, ~random, ~discord");
    } else if (message.toLowerCase() == "~kill") {
        bot.chat("type /kill brickzebra to kill the bot");
    } else if (message.toLowerCase() == "~ez") {
        bot.chat("EZ GG WP");
    } else if (message.toLowerCase() == "~properganda") {
        if (counter >= messages.length) {
            counter = 0;
        }

        let msg = messages[counter];

        if (spamming) {
            bot.chat(">" + (Math.floor(Math.random() * 10000)).toString() + " - " + msg);
        }

        counter++;
    } else if (message.toLowerCase() == "~ftop") {
        bot.chat("[1] Imperials, [2] Infinity Incursion, [3] Vortex Coallition, [4] Spawn niggers, [5] Emperium");
    } else if (message.toLowerCase() == "~random") {
        bot.chat(Math.floor(Math.random() * 10).toString());
    } else if (message.toLowerCase() == "~discord") {
        bot.chat("brickzebraS PUBLIC: https://discord.gg/HN34NCP");
    } else if (message.toLowerCase() == "~accept") {
        whiteList.forEach(function(entry) {
            if (entry == username) {
                bot.chat("/tpaccept");
            }
        });
    }


// BOT ANTI AFK
var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = ['forward', 'back', 'left', 'right']
var lastaction;
var pi = 3.14159;

bot.on('health', function() {
    if (bot.food < 15) {
        bot.activateItem();
        console.log("Ate something");
    }
});

bot.on('time', function() {
    if (connected < 1) {
        return;
    }
    
    if (lasttime < 0) {
        lasttime = bot.time.age;
        console.log("Age set to " + lasttime)
    } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval * 20 + randomadd;

        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction, false);
                moving = 0;
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random() * pi - (0.5 * pi);
                var pitch = Math.random() * pi - (0.5 * pi);
                bot.look(yaw, pitch, false);
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction, true);
                moving = 1;
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});



// BOT RESPAWN
bot.on('spawn', function() {
    connected = 1;
});

bot.on('end', function() {
    console.log("Disconnected. Waiting 10 seconds")
    bot.quit();
    lasttime = -1;
    moving = 0;
    connected = 0;
    bot = mineflayer.createBot({
        host: bot.host,
        port: bot.port,
        /* username: bot.username, password: bot.password */
    });
    console.log("reconnected.")
});


// DISCORD MINECRAFT STATS
var changeTopicToStats = false;

if (changeTopicToStats) {
    var ms = require('./minestat');

    // Channel Topic
    ms.init(process.argv[2], 25565, function(result) {
        if (ms.online) {
            console.log("Server is online running version " + ms.version + " with " + ms.current_players + " out of " + ms.max_players + " players.");

            getDiscordChannel(process.argv[2]).setTopic(ms.current_players + " / " + ms.max_players + " | Version: " + ms.version);
        }
    });
}

// DISCORD CHANNEL
function sendDiscordBotMessage(embed_message) {
	getDiscordChannel(process.argv[2]).send(embed_message);
}

var channels = {
    "0b0t.org": "xyz",
    "9b9t.com": "xyz",
    "constantiam.net": "xyz",
    "2b2t.org": "xyz",
    "anarchy.bar": "xyz",
    "8b8t.cf": "xyz",
    "6b9t.xyz": "xyz"
};

function getDiscordChannel(channel) {
	var ret = null;
	
	do {
		ret = client.channels.get(channels[process.argv[2]]);
	} while (ret == null);
	
    return ret;
}

// BOT MONEY

var GetPlayerMoney_temp_money = "0";

/**
 * For anyone reading this, i plan to make a command for "/bal, /pay" etc from economy servers, using this bot
 * @param player_username
 * @param player_amount
 * @returns
 */
function SavePlayerMoney(player_username, player_amount) {
    fs.unlinkSync("money\\" + player_username);

    fs.appendFile("money\\" + player_username, player_amount.toString(), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(player_username + "'s Money was saved to file. [" + player_amount.toString() + "]");

    });
}

/**
 * Sleeps for a given amount of milliseconds
 * @param milliseconds
 * @returns
 */
function sleep(milliseconds) {
    var start = new Date().getTime();

    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}