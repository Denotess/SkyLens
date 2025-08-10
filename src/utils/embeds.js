import { EmbedBuilder } from 'discord.js';
import { fmt } from './format.js';
export function buildNetworthEmbed(profile, username) {
  const b = profile?.networth_breakdown || {};
  const embed = new EmbedBuilder().setTitle(`Networth — ${username}`).addFields(
    { name: 'Purse', value: fmt(b.purse||0), inline: true },
    { name: 'Bank', value: fmt(b.bank||0), inline: true },
    { name: 'Auctions', value: fmt(b.auctions||0), inline: true },
    { name: 'Armor', value: fmt(b.armor||0), inline: true },
    { name: 'Collection', value: fmt(b.collection||0), inline: true }
  );
  return embed;
}
