const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = process.env.CHANNEL_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.id !== CHANNEL_ID) return;

  const roles = msg.member.roles.cache.filter(r => r.id !== msg.guild.id);

  if (roles.size === 0) {
    try {
      await msg.member.ban({ reason: 'Trap channel: no roles' });

      // 📢 Send log message
      const logChannel = msg.guild.channels.cache.get(LOG_CHANNEL_ID);
      if (logChannel) {
        logChannel.send(
          `🚫 Banned **${msg.author.tag}** (ID: ${msg.author.id}) for posting in trap channel`
        );
      }

    } catch (e) {
      console.log("Ban failed:", e.message);
    }
  }
});

client.login(process.env.TOKEN);
