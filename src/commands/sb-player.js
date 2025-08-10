import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { fetchSkyCryptProfile } from '../services/skycrypt.js';
import { progressBar } from '../utils/ui.js';
import { fmt } from '../utils/format.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sb-player')
    .setDescription('Full Skyblock stats (SkyCrypt)')
    .addStringOption(opt => opt.setName('username').setDescription('Minecraft username').setRequired(true)),
  async execute(interaction) {
    const username = interaction.options.getString('username', true);
    await interaction.deferReply();
    const profile = await fetchSkyCryptProfile(username);
    if (!profile) return interaction.editReply(`Player \\`${username}\\` not found or SkyCrypt limit reached.`);
    const networth = profile?.networth?.networth || 0;
    const skillsAvg = profile?.skills?.average || 0;
    const bar = progressBar(skillsAvg / 50, 10);
    const slayers = profile?.slayers || {};
    const sl = `${slayers.zombie || 0}-${slayers.spider || 0}-${slayers.wolf || 0}-${slayers.enderman || 0}`;
    const embed = new EmbedBuilder()
      .setTitle(`📊 Skyblock Stats — ${username}`)
      .addFields(
        { name: 'Networth', value: fmt(networth), inline: true },
        { name: 'Skills (avg)', value: `${Math.round(skillsAvg*10)/10} ${bar}`, inline: true },
        { name: 'Slayers', value: sl, inline: true },
      ).setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  }
};
