const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = process.env.CHANNEL_ID;

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.id !== CHANNEL_ID) return;

  // Count roles excluding @everyone
  const roleCount = msg.member.roles.cache.filter(
    r => r.id !== msg.guild.id
  ).size;

  // If user has ANY role → do nothing (whitelisted)
  if (roleCount > 0) return;

  // No roles → ban
  try {
    await msg.member.ban({ reason: 'Trap channel (no roles)' });
  } catch (e) {
    console.log('Ban failed:', e.message);
  }
});

client.login(process.env.TOKEN);
