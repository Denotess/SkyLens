import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { initDb } from './services/db.js';
import scheduler from './services/scheduler.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.commands = new Collection();

const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const { default: cmd } = await import(path.join(commandsPath, 'commands', file));
  if (cmd?.data && cmd?.execute) client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  initDb(); // ensure tables
  scheduler.start(client);
});

// interaction handler
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction, { client });
  } catch (err) {
    console.error('Interaction error', err);
    if (interaction.deferred || interaction.replied) await interaction.followUp({ content: 'Internal error.', ephemeral: true });
    else await interaction.reply({ content: 'Internal error.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
