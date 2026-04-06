// Generated with BotMaker.gg — AI-Powered Discord Bot Builder
// https://botmaker.gg

import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = await import(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
  for (const file of eventFiles) {
    const event = await import(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

// Default interactionCreate handler (only used if no events/interactionCreate.js exists)
const hasCustomHandler = fs.existsSync(path.join(__dirname, 'events', 'interactionCreate.js'));
if (!hasCustomHandler) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing /${interaction.commandName}:`, error);
      const reply = { content: 'There was an error executing this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  });
}

// Register commands on ready
client.once('ready', async () => {
  console.log(`Bot online as ${client.user.tag}`);
  console.log(`Serving ${client.guilds.cache.size} guild(s)`);

  // Register slash commands (guild commands = instant, global = up to 1hr)
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  if (commands.length > 0) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    try {
      const guildId = process.env.GUILD_ID;
      if (guildId) {
        // Guild commands register instantly
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands });
        console.log(`Registered ${commands.length} guild command(s)`);
      } else {
        // Fallback to global (takes up to 1 hour)
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log(`Registered ${commands.length} global command(s) — may take up to 1hr to appear`);
      }
    } catch (err) {
      console.error('Failed to register commands:', err);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
