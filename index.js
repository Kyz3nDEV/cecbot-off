const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = process.env.prefix;

client.login(process.env.BOT_TOKEN);
