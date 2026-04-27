const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers // ✅ needed for reliable member access
  ]
});

const CHANNEL_ID = process.env.CHANNEL_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

client.on('messageCreate', async (msg) => {
  try {
    if (msg.author.bot) return;
    if (msg.channel.id !== CHANNEL_ID) return;
    if (!msg.member) return;

    const roles = msg.member.roles.cache.filter(r => r.id !== msg.guild.id);

    if (roles.size === 0) {

      // 🧹 Delete spam message first
      await msg.delete().catch(() => {});

      // 🚫 Ban user + delete last 7 days of messages
      await msg.member.ban({
        reason: 'Trap channel: no roles',
        deleteMessageSeconds: 60 * 60 * 24 * 1
      });

      // 📢 Send log
      const logChannel = await msg.guild.channels
        .fetch(LOG_CHANNEL_ID)
        .catch(() => null);

      if (logChannel) {
        logChannel.send(
          `🚫 Banned **${msg.author.tag}** (ID: ${msg.author.id}) for posting in trap channel`
        );
      }
    }

  } catch (e) {
    console.log("Error handling trap message:", e);
  }
});

client.login(process.env.TOKEN);
