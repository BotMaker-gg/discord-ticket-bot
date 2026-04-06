// Generated with BotMaker.gg — AI-Powered Discord Bot Builder
// https://botmaker.gg

import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';

export const name = 'interactionCreate';

export async function execute(interaction) {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
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
    return;
  }

  // Handle button interactions
  if (interaction.isButton()) {
    try {
      if (interaction.customId === 'open_ticket') {
        await handleOpenTicket(interaction);
      } else if (interaction.customId === 'close_ticket') {
        await handleCloseTicket(interaction);
      } else if (interaction.customId === 'confirm_close') {
        await handleConfirmClose(interaction);
      }
    } catch (error) {
      console.error('Button interaction error:', error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
}

async function handleOpenTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  
  // Check if user already has a ticket
  const existingTicket = guild.channels.cache.find(
    channel => channel.name === `ticket-${user.username}` && channel.type === ChannelType.GuildText
  );
  
  if (existingTicket) {
    return await interaction.reply({
      content: `You already have an open ticket: ${existingTicket}`,
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  // Find or create Tickets category
  let ticketCategory = guild.channels.cache.find(
    channel => channel.name === 'Tickets' && channel.type === ChannelType.GuildCategory
  );
  
  if (!ticketCategory) {
    ticketCategory = await guild.channels.create({
      name: 'Tickets',
      type: ChannelType.GuildCategory
    });
  }

  // Get Support role
  const supportRole = guild.roles.cache.find(role => role.name === 'Support');

  // Create ticket channel
  const ticketChannel = await guild.channels.create({
    name: `ticket-${user.username}`,
    type: ChannelType.GuildText,
    parent: ticketCategory,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
      },
      {
        id: interaction.client.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
      },
      ...(supportRole ? [{
        id: supportRole.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
      }] : [])
    ]
  });

  const welcomeEmbed = new EmbedBuilder()
    .setTitle('🎫 Ticket Opened')
    .setDescription(`Ticket opened by ${user} — A support member will be with you shortly`)
    .setColor('#00ff00')
    .setTimestamp();

  const closeButton = new ButtonBuilder()
    .setCustomId('close_ticket')
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🔒');

  const row = new ActionRowBuilder().addComponents(closeButton);

  await ticketChannel.send({
    embeds: [welcomeEmbed],
    components: [row]
  });

  await interaction.editReply({
    content: `Ticket created! ${ticketChannel}`
  });
}

async function handleCloseTicket(interaction) {
  const channel = interaction.channel;
  const user = interaction.user;
  
  // Check if user can close ticket (creator or Support role)
  const supportRole = interaction.guild.roles.cache.find(role => role.name === 'Support');
  const canClose = channel.name === `ticket-${user.username}` || 
                   (supportRole && user.roles?.cache?.has(supportRole.id));
  
  if (!canClose) {
    return await interaction.reply({
      content: 'Only the ticket creator or Support staff can close this ticket.',
      ephemeral: true
    });
  }

  const confirmButton = new ButtonBuilder()
    .setCustomId('confirm_close')
    .setLabel('Confirm Close')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(confirmButton);

  await interaction.reply({
    content: 'Are you sure you want to close this ticket?',
    components: [row],
    ephemeral: true
  });
}

async function handleConfirmClose(interaction) {
  const channel = interaction.channel;
  
  // Extract username from channel name
  const username = channel.name.replace('ticket-', '');
  
  const summaryEmbed = new EmbedBuilder()
    .setTitle('🔒 Ticket Closed')
    .setDescription(`Ticket opened by: ${username}\nClosed by: ${interaction.user}`)
    .setColor('#ff0000')
    .setTimestamp();

  await interaction.reply({
    embeds: [summaryEmbed],
    content: 'This channel will be deleted in 5 seconds.'
  });

  setTimeout(async () => {
    try {
      await channel.delete();
    } catch (error) {
      console.error('Error deleting ticket channel:', error);
    }
  }, 5000);
}