var ConfigFile = require("../config.json"),
  Logger = require("./logger.js").Logger,
  Permissions = require("./permissions.js"),
  imgDirectory = require("../config.json").image_folder,
  Giphy = require("./giphy.js"),
  version = require("../package.json").version,
  unirest = require('unirest'),
  PythonShell = require('python-shell'),
  ad = require("../ad.json"),
  DebugMode,
  VerboseLog,
  DebugLogger = require("./logger.js").DebugModeLog,
  Defaulting = require("./serverdefaulting.js"),
  VerboseLogger = require("./logger.js").VerboseModeLog,
  DJ = require("./djlogic.js");

if (ConfigFile.bot_settings.verbose_logging === true) {
  VerboseLog = true;
} else {
  VerboseLog = false;
}

var Commands = [];

Commands.eval = {
  name: "eval",
  help: "Eval junk and whatnot!",
  level: 3,
  fn: function(bot, msg, suffix){
	  var ConfigFile = "undefined"
		  try {
			  bot.sendMessage(msg, "```" + eval(suffix) + "```");
		  }catch(e){
			  bot.sendMessage(msg, "Failed!\n\n```" + e.stack + "```")
		  }
}};

Commands.ping = {
  name: "ping",
  help: "Ping the server!",
  level: 0,
  fn: function(bot, msg) {
  var ping = new PythonShell('ping.py');  
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Ping is being executed.");
    }
    ping.on('message', function (message) {
    	var msgArray = [];
    	msgArray.push("*Please wait while I ping the server.*");
    	msgArray.push("--------------------------");
    	msgArray.push("**"+message+"**");
    	msgArray.push("--------------------------");
    	bot.sendMessage(msg.channel, msgArray)
    	});
    	ping.end(function (err) {
    	  if (err){
    	bot.sendMessage(msg.channel, "An error occurred");};
    	});
  }
};

Commands.list = {
  name: "list",
  help: "List currently playing users.!",
  level: 0,
  fn: function(bot, msg) {
  var list = new PythonShell('list.py');
	  if (VerboseLog === true) {
		  VerboseLogger.debug("VERBOSE LOG: List is being executed.");
	  }
	  list.on('message', function (message) {
		  var msgArray = [];
	    	msgArray.push("*Please wait while I check who is playing.*");
	    	msgArray.push("--------------------------");
	    	msgArray.push("**"+message+"**");
	    	msgArray.push("--------------------------");
	    	bot.sendMessage(msg.channel, msgArray)
    	});
    	list.end(function (err) {
    	  if (err){
    	bot.sendMessage(msg.channel, "An error occurred");};
    	});
  }
};

Commands.shop = {
  name: "shop",
  help: "PowerEclipse server shop.",
  level: 1,
  fn: function(bot, msg){
	  bot.sendMessage(msg.channel, "http://store.powereclipse.com");
}};

Commands.forum = {
  name: "forum",
  help: "PowerEclipse forum link.",
  level: 1,
  fn: function(bot, msg){
	bot.sendMessage(msg.channel, "http://forum.powereclipse.com");
}};

Commands.post = {
  name: "post",
  help: "PowerEclipse server ad.",
  level: 1,
  fn: function(bot, msg){
	bot.sendFile(msg.channel, ad.file);
	bot.sendMessage(msg.channel, ad.text);
}};

Commands.meh = {
  name: "meh",
  help: "*shrug*",
  level: 0,
  fn: function(bot, msg){
	  bot.sendMessage(msg.channel, "¯\\\\\\_(ツ)_/¯");
}};

Commands.lenny = {
  name: "lenny",
  help: "*Ayyyy*",
  level: 0,
  fn: function(bot, msg){
	  bot.sendMessage(msg.channel, "( ͡° ͜ʖ ͡°)");
}};

Commands.woosh = {
name: "woosh",
help: "**Woosh!**",
level: 0,
fn: function(bot, msg){
  bot.sendMessage(msg.channel, "**WOOSH**");
}};

Commands["join-voice"] = {
  name: "join-voice",
  help: "I'll join a voice channel!",
  usage: "[voice-channel-name]",
  level: 1,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: JoinVoice is being executed.");
    }
    DJ.joinVoice(bot, msg);
  }
};

Commands.play = {
  name: "play",
  help: "I'll play a weblink containing music!",
  usage: "<web-url>",
  level: 1,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Play is being executed.");
    }
    DJ.playMusicURL(bot, msg);
  }
};

Commands.stop = {
  name: "stop",
  help: "I'll stop playing music.",
  level: 1,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Stop is being executed.");
    }
    DJ.stopPlaying(msg);
  }
};

Commands["leave-voice"] = {
  name: "leave-voice",
  help: "I'll leave the current voice channel.",
  level: 1,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: LeaveVoice is being executed.");
    }
    DJ.leaveVoice(bot, msg);
  }
};

Commands.setstatus = {
  name: "setstatus",
  help: "This will change my current status to something else",
  usage: "<online / away> [playing status]",
  level: 1,
  fn: function(bot, msg, suffix) {
    var step = suffix.split(" "),
      status = step[0],
      playingstep = step.slice(1, step.length),
      playing = playingstep.join(" ");
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: SetStatus is being executed.");
    }
    if (!suffix) {
      bot.sendMessage(msg.channel, "You need a suffix, dummy!");
      return;
    }
    if (status !== "online" && suffix !== "away") {
      bot.sendMessage(msg.channel, "I can only be `online` or `away`!");
      return;
    }
    bot.setStatus(status, playing, function(error) {
      if (error) {
        bot.sendMessage(msg.channel, "Whoops, that doesn't work, try again.");
      } else if (playing) {
        bot.sendMessage(msg.channel, "Okay, I'm now " + status + " and playing " + playing);
      } else {
        bot.sendMessage(msg.channel, "Okay, I'm now " + status + ".");
      }
    });
  }
};

Commands.info = {
  name: "info",
  help: "I'll print some information about me.",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Info is being executed.");
    }
    var msgArray = [];
    msgArray.push("**PowerEclipse version " + version + "**");
    msgArray.push("Using latest 5.x.x *Discord.js* version by *hydrabolt*.");
    msgArray.push("<https://github.com/hydrabolt/discord.js>");
    msgArray.push("Made by <@96554096349175808>.");
    bot.sendMessage(msg.channel, msgArray);
  }
};

Commands.leave = {
  name: "leave",
  help: "I'll leave the server in which the command is executed, you'll need the *Manage server* permission in your role to use this command.",
  level: 1,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Leave is being executed.");
    }
    if (msg.channel.server) {
      bot.sendMessage(msg.channel, "Alright, see ya!");
      bot.leaveServer(msg.channel.server);
      Logger.log("info", "I've left a server on request of " + msg.sender.username + ", I'm only in " + bot.servers.length + " servers now.");
      return;
    } else {
      bot.sendMessage(msg.channel, "I can't leave a DM, dummy!");
      return;
    }
  }
};

Commands.say = {
  name: "say",
  help: "I'll echo the suffix of the command to the channel and, if I have sufficient permissions, deletes the command.",
  usage: "<text>",
  level: 1,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Say is being executed.");
    }
    if (suffix.search("!say") === -1) {
      bot.sendMessage(msg.channel, suffix);
      if (msg.channel.server) {
        var bot_permissions = msg.channel.permissionsOf(bot.user);
        if (bot_permissions.hasPermission("manageMessages")) {
          bot.deleteMessage(msg);
          return;
        } else {
          bot.sendMessage(msg.channel, "*This works best when I have the permission to delete messages!*");
        }
      }
    } else {
      bot.sendMessage(msg.channel, "HEY " + msg.sender + " STOP THAT!", {
        tts: "true"
      });
    }
  }
};

Commands.online = {
  name: "online",
  help: "I'll change my status to online.",
  level: 1, // If an access level is set to 4 or higher, only the master user can use this
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Online is being executed.");
    }
    bot.setStatusOnline();
    Logger.log("debug", "My status has been changed to online.");
  }
};

Commands.kill = {
  name: "kill",
  help: "This will instantly terminate all of the running instances of the bot without restarting.",
  level: 1, // If an access level is set to 4 or higher, only the master user can use this
  fn: function(bot, msg) {
      if (VerboseLog === true) {
        VerboseLogger.debug("VERBOSE LOG: Killswitch is being executed.");
      }
      bot.sendMessage(msg.channel, "An admin has requested to kill PE bot, exiting...");
      bot.logout();
      Logger.log("warn", "Disconnected via killswitch!");
      process.exit(255);
    } //exit node.js without an error
};

Commands.update = {
  name: "update",
  help: "I'll check if my code is up-to-date with the code from gitlab, and restart.",
  level: 4, // If an access level is set to 4 or higher, only the master user can use this
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: update is being executed.");
    }
    bot.sendMessage(msg.channel, "Fetching updates...", function(error, sentMsg) {
      Logger.log("info", "Updating...");
      var spawn = require('child_process').spawn;
      var log = function(err, stdout, stderr) {
        if (stdout) {
          Logger.log("debug", stdout);
        }
        if (stderr) {
          Logger.log("debug", stderr);
        }
      };
      var fetch = spawn('git', ['fetch']);
      fetch.stdout.on('data', function(data) {
        Logger("debug", data.toString());
      });
      fetch.on("close", function(code) {
        var reset = spawn('git', ['reset', '--hard', 'origin/master']);
        reset.stdout.on('data', function(data) {
          Logger.log("debug", data.toString());
        });
        reset.on("close", function(code) {
          var npm = spawn('npm', ['install']);
          npm.stdout.on('data', function(data) {
            Logger.log("debug", data.toString());
          });
          npm.on("close", function(code) {
            Logger.log("info", "Goodbye");
            bot.sendMessage(msg.channel, "brb!", function() {
              bot.logout(function() {
                process.exit();
              });
            });
          });
        });
      });
    });
  }
};

Commands.devs = {
  name: "devs",
  help: "This will print the Discord ID's from the developers of PowerEclipse to the channel.",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Devs is being executed.");
    }
    bot.sendMessage(msg.channel, "Made with love by <@96554096349175808>, <@106691570694098944> and <@106801100107100160>.");
  }
};

Commands.prune = {
  name: "prune",
  help: "I'll delete a certain ammount of messages.",
  usage: "<number-of-messages-to-delete>]",
  level: 2,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Purge is being executed.");
    }
    if (!msg.channel.server) {
      bot.sendMessage(msg.channel, "You can't do that in a DM, dummy!");
      return;
    }
    if (!suffix) {
      bot.sendMessage(msg.channel, "Please define an amount of messages for me to delete!");
      return;
    }
    if (!msg.channel.permissionsOf(msg.sender).hasPermission("manageMessages")) {
      bot.sendMessage(msg.channel, "Sorry, your role in this server does not have enough permissions.");
      return;
    }
    if (!msg.channel.permissionsOf(bot.user).hasPermission("manageMessages")) {
      bot.sendMessage(msg.channel, "I don't have permission to do that!");
      return;
    }
    if (suffix > 100) {
      bot.sendMessage(msg.channel, "The maximum is 100.");
      return;
    }
    bot.getChannelLogs(msg.channel, suffix, function(error, messages) {
      if (error) {
        bot.sendMessage(msg.channel, "Something went wrong while fetching logs.");
        return;
      } else {
        Logger.info("Beginning purge...");
        var todo = messages.length,
          delcount = 0;
        for (msg of messages) {
          bot.deleteMessage(msg);
          todo--;
          delcount++;
          if (todo === 0) {
            bot.sendMessage(msg.channel, "Done! Deleted " + delcount + " messages.");
            Logger.info("Ending purge, deleted " + delcount + " messages.");
            return;
          }
        }
      }
    });
  }
};

Commands.userinfo = {
		  name: "userinfo",
		  help: "I'll get some information about the user you've mentioned.",
		  level: 0,
		  fn: function(bot, msg){
		      var UserLevel = 0;
		      Permissions.GetLevel((msg.channel.server.id + msg.author.id), msg.author.id, function(err, level) {
		          if (err) {
		              return;
		          } else {
		              UserLevel = level;
		          }
		    if (msg.mentions.length === 0) {
		      var msgArray = [];
		      if (msg.author.avatarURL === null) {
		        msgArray.push("```");
		        msgArray.push("Requested user: " + msg.author.getAll.username);
		        msgArray.push("ID: " + msg.author.id);
		        msgArray.push("Status: " + msg.author.status);
		        msgArray.push("Current access level: " + UserLevel);
		        msgArray.push("```");
		        bot.sendMessage(msg.channel, msgArray);
		        return;
		      } else {
		        msgArray.push("```");
		        msgArray.push("Requested user: " + msg.author.username);
		        msgArray.push("ID: " + msg.author.id);
		        msgArray.push("Status: " + msg.author.status);
		        msgArray.push("Avatar: " + msg.author.avatarURL);
		        msgArray.push("Current access level: " + UserLevel);
		        msgArray.push("```");
		        bot.sendMessage(msg.channel, msgArray);
		      }
		      return;
		    }
		    msg.mentions.map(function(user) {
		            Permissions.GetLevel((msg.channel.server.id + user.id), user.id, function(err, level) {
		                if (err) {
		                    return;
		                } else {
		                    UserLevel = level;
		                }
		      var msgArray = [];
		      if (user.avatarURL === null) {
		        msgArray.push("```");
		        msgArray.push("Requested user: " + user.username);
		        msgArray.push("ID: " + user.id);
		        msgArray.push("Status: " + user.status);
		        msgArray.push("Current access level: " + UserLevel);
		        msgArray.push("```");
		        bot.sendMessage(msg.channel, msgArray);
		        return;
		      } else {
		        msgArray.push("```");
		        msgArray.push("Requested user: " + user.username);
		        msgArray.push("ID: " + user.id);
		        msgArray.push("Status: " + user.status);
		        msgArray.push("Avatar: " + user.avatarURL);
		        msgArray.push("Current access level: " + UserLevel);
		        msgArray.push("```");
		        bot.sendMessage(msg.channel, msgArray);
		      }
		    });
		})})}};

Commands.setlevel = {
  name: "setlevel",
  help: "This changes the permission level of an user.",
  level: 3,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: SetLevel is being executed.");
    }
    if (!msg.channel.server) {
      bot.sendMessage(msg.channel, "I can't do that in a PM!");
      return;
    }
    if (isNaN(suffix[0])) {
      bot.reply(msg.channel, "your first param is not a number!");
      return;
    }
    if (msg.mentions.length === 0) {
      bot.reply(msg.channel, "please mention the user(s) you want to set the permission level of.");
      return;
    }
    Permissions.GetLevel((msg.channel.server.id + msg.author.id), msg.author.id, function(err, level) {
      if (err) {
        bot.sendMessage(msg.channel, "Help! Something went wrong!");
        return;
      }
      if (suffix[0] > level) {
        bot.reply(msg.channel, "you can't set a user's permissions higher than your own!");
        return;
      }
    });
    msg.mentions.map(function(user) {
      Permissions.SetLevel((msg.channel.server.id + user.id), suffix[0], function(err, level) {
        if (err) {
          bot.sendMessage(msg.channel, "Help! Something went wrong!");
          return;
        }
      });
    });
    bot.sendMessage(msg.channel, "Alright! The permission levels have been set successfully!");
  }
};

Commands.setowner = {
  name: "setowner",
  help: "This will set the owner of the current server to level 3.",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: SetOwner is being executed.");
    }
    if (msg.channel.isPrivate) {
      bot.sendMessage(msg.channel, "You need to execute this command in a server, dummy!");
      return;
    } else {
      Permissions.SetLevel((msg.channel.server.id + msg.channel.server.owner.id), 3, function(err, level) {
        if (err) {
          bot.sendMessage(msg.channel, "Sorry, an error occured, try again later.");
          return;
        }
        if (level === 3) {
          bot.sendMessage(msg.channel, "Okay! " + msg.channel.server.owner + " is now at level 3!");
        }
      });
    }
  }
};

Commands.hello = {
  name: "hello",
  help: "Am I alive?!",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Hello is being executed.");
    }
    bot.sendMessage(msg.channel, "Pong!");
  }
};

Commands["server-info"] = {
  name: "server-info",
  help: "I'll tell you some information about the server and the channel you're currently in.",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Server-Info is being executed.");
    }
    // if we're not in a PM, return some info about the channel
    if (msg.channel.server) {
      var msgArray = [];
      msgArray.push("You are currently in " + msg.channel + " (id: " + msg.channel.id + ")");
      msgArray.push("on server **" + msg.channel.server.name + "** (id: " + msg.channel.server.id + ") (region: " + msg.channel.server.region + ")");
      msgArray.push("owned by " + msg.channel.server.owner + " (id: " + msg.channel.server.owner.id + ")");
      if (msg.channel.topic) {
        msgArray.push("The current topic is: " + msg.channel.topic);
      }
      bot.sendMessage(msg, msgArray);
    } else {
      bot.sendMessage(msg, "You can't do that in a DM, dummy!.");
    }
  }
};

Commands.idle = {
  name: "idle",
  help: "This will change my status to idle.",
  level: 1, // If an access level is set to 4 or higher, only the master user can use this
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Idle is being executed.");
    }
    bot.setStatusIdle();
    Logger.log("debug", "My status has been changed to idle.");
  }
};

Commands.status = {
  name: "status",
  help: "I'll get some info about me, like uptime and currently connected servers.",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Status is being executed.");
    }
    var msgArray = [];
    msgArray.push("Hello, I'm " + bot.user + ", nice to meet you!");
    msgArray.push("I'm used in " + bot.servers.length + " servers, and in " + bot.channels.length + " channels.");
    msgArray.push("My uptime is " + (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.");
    bot.sendMessage(msg.channel, msgArray);
  }
};

Commands.iff = {
  name: "iff",
  help: "''**I**mage **F**rom **F**ile'', I'll get a image from the image folder for you and upload it to the channel.",
  usage: "<image>",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: IFF is being executed.");
    }
    var fs = require("fs");
    var path = require("path");
    var ext = [".jpg", ".jpeg", ".gif", ".png"];
    var imgArray = [];
    fs.readdir("./images", function(err, dirContents) {
      for (var i = 0; i < dirContents.length; i++) {
        for (var o = 0; o < ext.length; o++) {
          if (path.extname(dirContents[i]) === ext[o]) {
            imgArray.push(dirContents[i]);
          }
        }
      }
      if (imgArray.indexOf(suffix) !== -1) {
        bot.sendFile(msg.channel, "./images/" + suffix);
        if (!msg.channel.server) {
          return;
        }
        var bot_permissions = msg.channel.permissionsOf(bot.user);
        if (bot_permissions.hasPermission("manageMessages")) {
          bot.deleteMessage(msg);
          return;
        } else {
          bot.sendMessage(msg.channel, "*This works best when I have the permission to delete messages!*");
        }
      } else {
        bot.sendMessage(msg.channel, "*Invalid input!*");
      }
    });
  }
};

Commands.gif = {
  name: "gif",
  help: "I will search Giphy for a gif matching your tags.",
  usage: "<image tags>",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Gif is being executed.");
    }
    var tags = suffix.split(" ");
    Giphy.get_gif(tags, function(id) {
      if (typeof id !== "undefined") {
        bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
      } else {
        bot.sendMessage(msg.channel, "Invalid tags, try something different. For example, something that exists [Tags: " + (tags ? tags : "Random GIF") + "]");
      }
    });
  }
};

Commands.imglist = {
  name: "imglist",
  help: "Prints the contents of the images directory to the channel.",
  level: 0,
  fn: function(bot, msg) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: ImgList is being executed.");
    }
    var fs = require("fs");
    var path = require("path");
    var ext = [".jpg", ".jpeg", ".gif", ".png"];
    var imgArray = [];
    fs.readdir("./images", function(err, dirContents) {
      for (var i = 0; i < dirContents.length; i++) {
        for (var o = 0; o < ext.length; o++) {
          if (path.extname(dirContents[i]) === ext[o]) {
            imgArray.push(dirContents[i]);
          }
        }
      }
      bot.sendMessage(msg.channel, imgArray);
    });
  }
};

Commands.stroke = {
  name: "stroke",
  help: "I'll stroke someones ego, how nice of me.",
  usage: "[First name][, [Last name]]",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Stroke is being executed.");
    }
    var name;
    if (suffix) {
      name = suffix.split(" ");
      if (name.length === 1) {
        name = ["", name];
      }
    } else {
      name = ["Perpetu", "Cake"];
    }
    var request = require('request');
    request('http://api.icndb.com/jokes/random?escape=javascript&firstName=' + name[0] + '&lastName=' + name[1], function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var joke = JSON.parse(body);
        bot.sendMessage(msg.channel, joke.value.joke);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.yomomma = {
  name: "yomomma",
  help: "I'll get a random yo momma joke for you.",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: YoMomma is being executed.");
    }
    var request = require('request');
    request('http://api.yomomma.info/', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var yomomma = JSON.parse(body);
        bot.sendMessage(msg.channel, yomomma.joke);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.advice = {
  name: "advice",
  help: "I'll give you some great advice, I'm just too kind.",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Advice is being executed.");
    }
    var request = require('request');
    request('http://api.adviceslip.com/advice', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var advice = JSON.parse(body);
        bot.sendMessage(msg.channel, advice.slip.advice);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.yesno = {
  name: "yesno",
  help: "Ever wanted a gif displaying your (dis)agreement? Then look no further!",
  usage: "optional: [force yes/no/maybe]",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: YesNo is being executed.");
    }
    var request = require('request');
    request('http://yesno.wtf/api/?force=' + suffix, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var yesNo = JSON.parse(body);
        bot.sendMessage(msg.channel, msg.sender + " " + yesNo.image);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.xkcd = {
  name: "xkcd",
  help: "I'll get a XKCD comic for you, you can define a comic number and I'll fetch that one.",
  usage: "[current, or comic number]",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: XKCD is being executed.");
    }
    var request = require('request');
    request('http://xkcd.com/info.0.json', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var xkcdInfo = JSON.parse(body);
        if (suffix) {
          var isnum = /^\d+$/.test(suffix);
          if (isnum) {
            if ([suffix] < xkcdInfo.num) {
              request('http://xkcd.com/' + suffix + '/info.0.json', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                  xkcdInfo = JSON.parse(body);
                  bot.sendMessage(msg.channel, xkcdInfo.img);
                } else {
                  Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
                }
              });
            } else {
              bot.sendMessage(msg.channel, "There are only " + xkcdInfo.num + " xkcd comics!");
            }
          } else {
            bot.sendMessage(msg.channel, xkcdInfo.img);
          }
        } else {
          var xkcdRandom = Math.floor(Math.random() * (xkcdInfo.num - 1)) + 1;
          request('http://xkcd.com/' + xkcdRandom + '/info.0.json', function(error, response, body) {
            if (!error && response.statusCode == 200) {
              xkcdInfo = JSON.parse(body);
              bot.sendMessage(msg.channel, xkcdInfo.img);
            } else {
              Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
            }
          });
        }

      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.dice = {
  name: "dice",
  help: "I'll roll some dice for you, handy!",
  usage: "[numberofdice]d[sidesofdice]",
  level: 0,
  fn: function(bot, msg, suffix) {
    if (VerboseLog === true) {
      VerboseLogger.debug("VERBOSE LOG: Dice is being executed.");
    }
    var dice;
    if (suffix) {
      dice = suffix;
    } else {
      dice = "d6";
    }
    var request = require('request');
    request('https://rolz.org/api/?' + dice + '.json', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var roll = JSON.parse(body);
        bot.sendMessage(msg.channel, "Your " + roll.input + " resulted in " + roll.result + " " + roll.details);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.fancyinsult = {
  name: "fancyinsult",
  help: "I'll insult your friends, in style.",
  level: 0,
  fn: function(bot, msg, suffix) {
    var request = require('request');
    request('http://quandyfactory.com/insult/json/', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var fancyinsult = JSON.parse(body);
        if (suffix === "") {
          bot.sendMessage(msg.channel, fancyinsult.insult);
          bot.deleteMessage(msg);
        } else {
          bot.sendMessage(msg.channel, suffix + ", " + fancyinsult.insult);
          bot.deleteMessage(msg);
        }
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands["8ball"] = {
  name: "8ball",
  help: "I'll function as an magic 8 ball for a bit and anwser all of your questions! (So long as you enter the questions as suffixes.)",
  usage: "<question>",
  level: 0,
  fn: function(bot, msg, suffix) {
    var request = require('request');
    request('https://8ball.delegator.com/magic/JSON/0', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var eightBall = JSON.parse(body);
        bot.sendMessage(msg.channel, eightBall.magic.answer + ", " + msg.sender);
      } else {
        Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
      }
    });
  }
};

Commands.help = {
  name: "help",
  help: "You're looking at it right now.",
  level: 0,
  fn: function(bot, msg, suffix) {
    var msgArray = [];
    var commandnames = []; // Build a array of names from commands.
    if (!suffix) {
      for (index in Commands) {
        commandnames.push(Commands[index].name);
      }
      msgArray.push("These are the currently avalible commands, use `" + ConfigFile.bot_settings.cmd_prefix + "help <command_name>` to learn more about a specific command.");
      msgArray.push("");
      msgArray.push(commandnames.join(", "));
      msgArray.push("");
      msgArray.push("If you have any questions, or if you don't get something, contact <@96554096349175808>");
      if (ConfigFile.bot_settings.help_mode === "private") {
        bot.sendMessage(msg.author, msgArray);
        Logger.debug("Send help via DM.");
        if (msg.channel.server) {
          bot.sendMessage(msg.channel, "Ok " + msg.author + ", I've sent you a list of commands via DM.");
        }
      } else if (ConfigFile.bot_settings.help_mode === "channel") {
        bot.sendMessage(msg.channel, msgArray);
        Logger.debug("Send help to channel.");
      } else {
        Logger.error("Config File error! Help mode is incorrectly defined!");
        bot.sendMessage(msg.channel, "Sorry, my owner didn't configure me correctly!");
      }
    }
    if (suffix) {
      if (Commands[suffix]) { // Look if suffix corresponds to a command
        var commando = Commands[suffix]; // Make a varialbe for easier calls
        msgArray = []; // Build another message array
        msgArray.push("**Command:** `" + commando.name + "`"); // Push the name of the command to the array
        msgArray.push(""); // Leave a whiteline for readability
        if (commando.hasOwnProperty("usage")) { // Push special message if command needs a suffix.
          msgArray.push("**Usage:** `" + ConfigFile.bot_settings.cmd_prefix + commando.name + " " + commando.usage + "`");
        } else {
          msgArray.push("**Usage:** `" + ConfigFile.bot_settings.cmd_prefix + commando.name + "`");
        }
        msgArray.push("**Description:** " + commando.help); // Push the extendedhelp to the array.
        if (commando.hasOwnProperty("nsfw")) { // Push special message if command is restricted.
          msgArray.push("**This command is NSFW, so it's restricted to certain channels and DM's.**");
        }
        if (commando.hasOwnProperty("timeout")) { // Push special message if command has a cooldown
          msgArray.push("**This command has a cooldown of " + commando.timeout + " seconds.**");
        }
        msgArray.push("**Needed access level:** " + commando.level); // Push the needed access level to the array
        if (suffix == "meme") { // If command requested is meme, print avalible meme's
          msgArray.push("");
          var str = "**Currently available memes:\n**";
          var meme = require("./memes.json");
          for (var m in meme) {
            str += m + ", ";
          }
          msgArray.push(str);
        }
        if (ConfigFile.bot_settings.help_mode === "private") {
          bot.sendMessage(msg.author, msgArray);
          Logger.debug("Send suffix help via DM.");
        } else if (ConfigFile.bot_settings.help_mode === "channel") {
          bot.sendMessage(msg.channel, msgArray);
          Logger.debug("Send suffix help to channel.");
        } else {
          Logger.error("Config File error! Help mode is incorrectly defined!");
          bot.sendMessage(msg.channel, "Sorry, my owner didn't configure me correctly!");
        }
      } else {
        bot.sendMessage(msg.channel, "There is no **" + suffix + "** command!");
      }
    }
  }
};

exports.Commands = Commands;
