const Discord = require('discord.js');

const client = new Discord.Client();

 

client.on('ready', () => {

    console.log('I am ready!');

});

 

client.on('message', message => {

    if (message.content === 'ping') {

       message.reply('pong');

       }

});



client.login(process.env.NDc5NzQwNTk1MjgwMDE5NDYw.W3XXPw.DA7oU3AU3DMSMyNd3a0Wb1A0OCw);