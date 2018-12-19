const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = process.env.prefix;

client.login(process.env.BOT_TOKEN);

client.on("message", message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLowerCase() === prefix + "clear") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(":x: Vous n'avez pas la permission d'exécuter cette commande !")
        let count = args[1]
        if(!count) return message.channel.send(":x: Veuillez indiquez un nombre de message à supprimer !")
        if(isNaN(count)) return message.channel.send(":x:Veuillez entrez un nombre valide !")
        if (count < 1 || count > 100) return message.channel.send(":x: Veuillez indiquez un nombre entre 1 et 100 !")
        message.channel.bulkDelete(parseInt(count) + 1)
    }

    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(":x: Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send(":x: Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(':white_check_mark:' + member + ' a été mute ')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(':white_check_mark: ' + member + ' a été mute')
            })
        }
    }
   
})

client.on('message', message =>{
    if(message.content === "-infobot"){
        message.reply(' BOT crée par **Kyz3n** , le 16/12/2018 , bot de **modération**');
        console.log('répond à infobot');
    }
});

client.on('message', message =>{
    if(message.content === "prefix"){
        message.reply('Voici mon préfixe : **-** ');
        console.log('répond à prefix');
    }
});

client.on('message', message =>{
    if(message.content === prefix + "live"){
        message.guild.channels.get('524242206685528073').send('**@everyone** :tada: **Je suis en live !** , venez me voir ! :https://www.youtube.com/channel/UCOJre8drkHONeNXCl_xwsXA ');
        console.log('répond à prefix');
    }
});

client.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':tada: Bienvenue **' + member.user.username + '** sur **' + member.guild.name + '**')
        .setFooter('Nous somme désormais ' + member.guild.memberCount + ' sur le serveur')
        .setColor(3447003)
        .setAuthor('CEC | BOT')
        member.guild.channels.get('523933228592267276').send(embed)
        member.addRole('523933250515894273')
})

client.on('guildMemberRemove', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':wave: Aurevoir **' + member.user.username + '**')
        .setFooter('Nous somme désormais ' + member.guild.memberCount + ' sur le serveur')
        .setColor(3447003)
        .setAuthor('CEC | BOT')
    member.guild.channels.get('523933228592267276').send(embed)
})

/*Kick*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase() === prefix + 'kick'){
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
       if (!member.kickable) return message.channel.send(":x: Je ne peux pas exclure cet utilisateur ")
       member.kick()
       message.channel.send(":white_check_mark: **"+member.user.username + '** a été exclu ')
    }
});

/*Ban*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase() === prefix + 'ban'){
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send(":x: Je ne peux pas bannir cet utilisateur")
       message.guild.ban(member, {days: 7})
       message.channel.send(":white_check_mark: **"+member.user.username + '** a été banni ')
    }
});
