var rules = require("../rules.json");

exports.arg = function(bot, msg, suffix) {
	var args = suffix;
        // Default response
        var response = msg.author + " Check your command, that either was not a rule or you made a mistake!";
        // If the entry exists
        if (rules.r[args]) {
            // If there is a mention, tag the user
            if (msg.mentions.length === 1) {
                response = rules.r[args] + ", " + msg.mentions[0].mention() ;
            } else {
                response = rules.r[args];
            }
        }
        // Send the response
        bot.sendMessage(msg.channel, response);
};