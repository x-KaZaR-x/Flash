const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const newUsers = new Discord.Collection();
const bot = new Discord.Client();
const prefix = '!';
const ms = require ("ms");
const ddiff = require ("return-deep-diff");

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);
    bot.user.setActivity("Breaking Bad", {type: "WATCHING"});
  
});

bot.login(botconfig.token);

////////////////////////////////////COMMANDS//////////////////////////////////////////////////

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
  
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


//HELP COMMAND 
if(cmd === `${prefix}help`) {
        message.delete()

        let bicon = bot.user.displayAvatarURL
        let sicon = message.guild.iconURL
        let helpembed = new Discord.RichEmbed()
        .setTitle ("__**:robot: Help and Bot commands**__")
        .setDescription ("This is the list of the commands available for the bot. A command always start with <!> and when something is in <brackets> you have to put a parameter instead (without the brackets ^^)")
        .setColor ("#004de6")
        .addBlankField ()
        .addField ("!serverinfo", "will display some informations about the server")
        .addField ("!invitation", "Dispay a invitation link you can share to invite your friends to the server")
        .addField ("!help", "Will display the list of the commands")
        .addField ("!report <@tag-a-user> <reason>", "Will create a report in the right channel, you have to specify a reason !")
        .addField ("!kick <@tag-a-user>", "will kick the user (kick-members permission needed)")
        .addField ("!ban <@tag-a-user>", "will ban the user (ban-members permission needed)")
        .addField ("!mute <@tag-a-user> <nbr> <s/m/d>", "will mute the user for the specified duration and automatically unmute him (mute-members permission needed)")
        .addField ("!clear <nbr>", "will delete the specified number of messages in the channel you are typing this command (manage-messages permission needed)")
        .addBlankField ()
        .setFooter ("In order to keep the channel clean this message will be deleted in 1 minute but you can call this command anytime you want !");

            return message.channel.send(helpembed).then(msg => msg.delete (60000));

}
    

//invite link
if(cmd === `${prefix}invitation`) {
     message.delete()
     message.channel.send ("Bip Boop... Aaaand tada ! --> https://discord.gg/mTJEMYP ").then(msg => msg.delete (60000));
}
   

//SERVER INFO COMMAND
if(cmd === `${prefix}serverinfo`) {
        message.delete()

        let botembed = new Discord.RichEmbed()
        .setTitle ("__**Server Informations**__")
        .setDescription ("")
        .setColor ("#004de6")
        .addBlankField ()
        .addField ("Server Name", message.guild.name)
        .addField ("Created On", message.guild.createdAt)
        .addField ("Created By", "KaZaR")
        .addField ("Total Members", message.guild.memberCount)
        .addField ("Invitaton link", "https://discord.gg/mTJEMYP feel free to use it!")
        .addBlankField ()
        .addField ("Bot name", bot.user.username)
        .addField ("Bot creator", "KaZaR")
        .addBlankField ()
        .addField ("You joined", message.member.joinedAt)
        .addBlankField ()
        .setFooter ("In order to keep the channel clean this message will be deleted in 1 minute but you can call this command anytime you want !");

            return message.channel.send(botembed).then(msg => msg.delete (60000));
}


//REPORT COMMAND //add dm to the reported
if(cmd === `${prefix}report`) {
        message.delete()
        let rUser = message.guild.member(message.mentions.users.first());
        if (!rUser) return message.channel.send(":thinking: Hmmm... Couldn't find the user you want to report ! ").then(msg => msg.delete (20000));
        let reason = args.join (" ").slice(22);

        let reportembed = new Discord.RichEmbed()
        .setTitle ("__**:warning: Report**__")
        .setDescription (" ")
        .setColor ("#004de6")
        .addField ("Reported User", `${rUser}`)
        .addField ("Reported By", `${message.author}`)
        .addField ("Channel", message.channel)
        .addField ("Reason", reason)
        .setTimestamp (new Date());

        let reportschannel = message.guild.channels.find(`name`, "admins-logs");
        reportschannel.send(reportembed);
}


//KICK COMMAND
if(cmd === `${prefix}kick`) {
    message.delete()
    let kUser = message.guild.member(message.mentions.users.first());
    let kReason = args.join (" ").slice(22);
    if (!kUser) {
        message.channel.send(":thinking: Hmmm... Couldn't find the user you want to kick ! ").then(msg => msg.delete (20000));
        return;
    }
    
    
    if(kUser.hasPermission("ADMINISTRATOR")) {
        message.channel.send ("Who do you think you are bro :laughing: ? Are you trying to kick an Admin ?").then(msg => msg.delete (20000));
        
        let kickfailed = new Discord.RichEmbed()
        .setTitle ("__**Kick Attempt Failed**__")
        .setDescription (`${message.author} tried to kick ${kUser}`)
        .setColor ("#F56106")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(kickfailed);
        return;
    }
    
    
    if(!message.member.hasPermission("KICK_MEMBERS")) { 
        message.channel.send (":x: You dont have the permission to do that pal' ").then(msg => msg.delete (20000));
        
        let kickfailed = new Discord.RichEmbed()
        .setTitle ("__**Kick Attempt Failed**__")
        .setDescription (`${message.author} tried to kick ${kUser}`)
        .setColor ("#F56106")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(kickfailed);
        return;
    }
    

    let kgif = "https://media.giphy.com/media/xTcnTjeH5rtf6bdlwA/giphy.gif"
    let kickembed = new Discord.RichEmbed()
    .setTitle ("__**:right_facing_fist: Kick Report**__")
    .setDescription (`${kUser}` + " has been successfully kicked ")
    .setColor ("#004de6")
    .setImage (kgif)
    .addField ("Kicked By", `${message.author}`)
    .addField ("Reason", kReason)
    .setTimestamp (new Date());


    message.guild.member(kUser).kick(kReason);
    let reportschannel = message.guild.channels.find(`name`, "announcements");
    reportschannel.send(kickembed);

    return;
}


//BAN COMMAND
if(cmd === `${prefix}ban`) {
    message.delete()
    let bUser = message.guild.member(message.mentions.users.first());
    let bReason = args.join (" ").slice(22);
    if (!bUser) {
        message.channel.send("Hmmm... :thinking: Couldn't find the user you want to ban ! ").then(msg => msg.delete (20000));
        return;
    }
    if(bUser.hasPermission("ADMINISTRATOR")) {
        message.channel.send ("Who do you think you are bro :laughing: ? Are you trying to ban an Admin ?").then(msg => msg.delete (20000));
        
        let banfailed = new Discord.RichEmbed()
        .setTitle ("__**Ban Attempt Failed**__")
        .setDescription (`${message.author} tried to ban ${bUser}`)
        .setColor ("#FB0808")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(banfailed);

        return;
    }
    if(!message.member.hasPermission("BAN_MEMBERS")) { 
        message.channel.send (":x: You dont have the permission to do that pal' ").then(msg => msg.delete (20000));
        
        let banfailed = new Discord.RichEmbed()
        .setTitle ("__**Ban Attempt Failed**__")
        .setDescription (`${message.author} tried to ban ${bUser}`)
        .setColor ("#FB0808")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(banfailed);
        return;
    }
    

    let bgif = "https://media.giphy.com/media/3o751XbGLXpORSxtQY/giphy.gif"
    let banembed = new Discord.RichEmbed()
    .setTitle ("__**:crossed_swords: Ban Report**__")
    .setThumbnail (bicon)
    .setDescription (`${bUser}` + " has been successfully banned ")
    .setColor ("#004de6")
    .setImage (bgif)
    .addField ("Banned By", `${message.author}`)
    .addField ("Reason", bReason)
    .setTimestamp (new Date());


    message.guild.member(bUser).ban(bReason);
    let reportschannel = message.guild.channels.find(`name`, "announcements");
    reportschannel.send(banembed);

    return;
}


//TEMP MUTE COMMAND
if(cmd === `${prefix}mute`) {
    message.delete()
let tomute = message.guild.member(message.mentions.users.first());
if (!tomute) {
    message.channel.send("Hmmm... :thinking: Couldn't find the user you want to mute ! ").then(msg => msg.delete (20000));
    return;
}
if(tomute.hasPermission("ADMINISTRATOR")) {
    message.channel.send ("Who do you think you are bro :laughing: ? Are you trying to mute an Admin ?");
    
    let mutefailed = new Discord.RichEmbed()
        .setTitle ("__**Mute Attempt Failed**__")
        .setDescription (`${message.author} tried to ban ${tomute}`)
        .setColor ("#F5F506")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(mutefailed);
    return;
}
if(!message.member.hasPermission("MUTE_MEMBERS")) { 
    message.channel.send (":x: You dont have the permission to do that pal' ").then(msg => msg.delete (20000));
    let mutefailed = new Discord.RichEmbed()
        .setTitle ("__**Mute Attempt Failed**__")
        .setDescription (`${message.author} tried to ban ${tomute}`)
        .setColor ("#F5F506")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(mutefailed);
    return;
}
  let muterole = message.guild.roles.find(`name`, "Muted");
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  ///embed mute start
    let mutegif = "https://media1.tenor.com/images/c0b3dc147c641d97491551de6694de61/tenor.gif?itemid=9195951"
    let muteembed = new Discord.RichEmbed()
    .setTitle ("__**:mute: Mute Report**__")
    .setDescription (`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`)
    .setColor ("#004de6")
    .setImage (mutegif)
    .addField ("Muted By", `${message.author}`)
    .addField ("Time", message.createdAt)
    .setTimestamp (new Date());

    let reportschannel = message.guild.channels.find(`name`, "general-chat");
    reportschannel.send(muteembed);


  setTimeout(function(){
    tomute.removeRole(muterole.id);
    ///message mute stop
    
  }, ms(mutetime));

}


//CLEAR COMMAND
if(cmd === `${prefix}clear`) {
    message.delete()
    if(!message.member.hasPermission("MANAGE_MESSAGES")) { 
        message.channel.send (":x: You dont have the permission to do that pal' ").then(msg => msg.delete (20000));
        
        let clearfailed = new Discord.RichEmbed()
        .setTitle ("__**Clearing Attempt Failed**__")
        .setDescription (`${message.author} tried to clear ${message.channel.name} channel`)
        .setColor ("#F5F506")
        .setTimestamp (new Date());
    
        let privatelogs = message.guild.channels.find(`name`, "admins-logs");
        privatelogs.send(clearfailed);
        return;
    }
    
    if(!args[0]) return message.channel.send ("You have to specify the amount of messages you want to delete").then(msg => msg.delete (20000));
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(` :white_check_mark: Cleared ${args[0]} messages`).then(msg => msg.delete (20000));
    });

}

///LAST LINE FOR COMMANDS///
});

///EVENTS//////////


bot.on("guildMemberAdd", (member) => {
  
    console.log(`New User ${member} has joined ${member.guild.name}` );
    member.addRole(member.guild.roles.find("name", "Guest")); //add a default role !change the name of the role!
    
      let welcomechannel = member.guild.channels.find('name', 'general-chat');
      let welcomeembed = new Discord.RichEmbed()
      .setColor("#004de6")
      .setTitle(':satellite: New Member ! :satellite: ')
      .setDescription(`Hey ${member} welcome to ${member.guild.name} !`);
  
  return welcomechannel.send(welcomeembed)
  
});

bot.on("guildMemberRemove", (member) => {

    console.log(`New User ${member} just bailed on the server` );

      let leavechannel = member.guild.channels.find('name', 'general-chat');
      let leaveembed = new Discord.RichEmbed()
      .setColor("#004de6")
      .setTitle(':satellite: Good riddance ! :satellite: ')
      .setDescription(`${member} is gone !`);
  
  return leavechannel.send(leaveembed)
});
  
bot.on("roleDelete", (role) => {

    let logschannel = role.guild.channels.find('name', 'admins-logs');
    let RDeleteembed = new Discord.RichEmbed()
    .setColor("#004de6")
    .setDescription(`:x: The role ${role.name} does not longer exist`);

return logschannel.send(RDeleteembed)
});

bot.on("roleCreate", (role) => {

    let logschannel = role.guild.channels.find('name', 'general-chat');
    let RCreateembed = new Discord.RichEmbed()
    .setColor("#004de6")
    .setDescription(`A role called ${role.name} have been created`);

return logschannel.send(RCreateembed)
});

bot.on("roleUpdate", async (oldRole, newRole) => {

    let logschannel = newRole.guild.channels.find('name', 'admins-logs');
        if(oldRole.displayName == newRole.displayName){
        return;
        }

    let RUpdateembed = new Discord.RichEmbed()
    .setColor("#004de6")
    .setDescription(`The role ${oldRole.name} has been changed to ${newRole}`);

return logschannel.send(RUpdateembed)
});

bot.on("guildMemberUpdate", async (oldMember, newMember) => {

  let logschannel = newMember.guild.channels.find('name', 'general-chat');
   
    if(oldMember.displayName == newMember.displayName){
        return;
   }

    let UUpdateembed = new Discord.RichEmbed()
    .setColor("#004de6")
    .setDescription(`${oldMember.displayName} changed his name to ${newMember}`);

return logschannel.send(UUpdateembed)
});

bot.on("channelCreate", async (channel) => {

    let logschannel = channel.guild.channels.find('name', 'admins-logs');
  
      let newChanEmbed = new Discord.RichEmbed()
      .setColor("#004de6")
      .setDescription(`A ${channel.type} channel with the name of ${channel.name} have been created !`);

     
  
  return logschannel.send(newChanEmbed);
  });
  
bot.on("channelDelete", async (channel) => {

    let logschannel = channel.guild.channels.find('name', 'admins-logs');
  
      let delChanEmbed = new Discord.RichEmbed()
      .setColor("#004de6")
      .setDescription(`The ${channel.type} channel with the name of ${channel.name} have been deleted !`);
    
      return logschannel.send(delChanEmbed);
  });

//bot.on("channelUpdate", async (oChannel, nChannel) => {

 //let logschannel = oChannel.guild.channels.find('name', 'admins-logs');
  
   // let newChanEmbed = new Discord.RichEmbed()
    //.setColor("#004de6")
    //.setTitle(`The ${oChannel.type} channel with the name of ${oChannel.name} have been updated !`)
    //.setDescription ("");
  
  //return logschannel.send(newChanEmbed);
  //});
  
bot.on("channelPinsUpdate", async (channel, time) => {

    let logschannel = channel.guild.channels.find('name', 'general-chat');
     
       let newChanEmbed = new Discord.RichEmbed()
       .setColor("#004de6")
       .setDescription (`Channel Pins in ${channel.name} have been updated !`);

     return logschannel.send(newChanEmbed);
     });
     