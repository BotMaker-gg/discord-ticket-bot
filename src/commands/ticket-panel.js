// Generated with BotMaker.gg — AI-Powered Discord Bot Builder
// https://botmaker.gg

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ticket-panel')
  .setDescription('Create a ticket panel for users to open support tickets')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  try {
    // Check if Support role exists, create if not
    let supportRole = interaction.guild.roles.cache.find(role => role.name === 'Support');
    if (!supportRole) {
      supportRole = await interaction.guild.roles.create({
        name: 'Support',
        color: '#00ff00',
        reason: 'Created by ticket system'
      });
      console.log(`Created Support role in ${interaction.guild.name}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 Support Tickets')
      .setDescription('Click the button below to open a ticket')
      .setColor('#5865F2');

    const button = new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('Open Ticket')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🎫');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: 'Ticket panel created!',
      ephemeral: true
    });

    await interaction.followUp({
      embeds: [embed],
      components: [row]
    });

  } catch (error) {
    console.error('Error creating ticket panel:', error);
    await interaction.reply({
      content: 'Failed to create ticket panel.',
      ephemeral: true
    });
  }
}