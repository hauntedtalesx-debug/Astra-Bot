import { Events, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { prisma } from "@astra/db";

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    try {
      const welcomeSettings = await prisma.welcomeMessage.findUnique({
        where: { guildId: member.guild.id },
        include: { guild: { include: { settings: true } } }
      });

      if (!welcomeSettings) return;

      // Check Feature Flag
      if (welcomeSettings.guild.settings && !welcomeSettings.guild.settings.welcomeEnabled) {
        return;
      }

      const channel = member.guild.channels.cache.get(welcomeSettings.channelId) as TextChannel;
      if (!channel || !channel.isTextBased()) return;

      const botPermissions = channel.permissionsFor(member.guild.members.me!);
      if (!botPermissions?.has("SendMessages") || !botPermissions?.has("EmbedLinks")) {
        return;
      }

      const text = welcomeSettings.messageText
        .replace(/{user}/g, `<@${member.id}>`)
        .replace(/{server}/g, member.guild.name);

      const embed = new EmbedBuilder()
        .setColor("#FF69B4")
        .setDescription(text);

      if (welcomeSettings.imageUrl) {
        embed.setImage(welcomeSettings.imageUrl);
      }

      await channel.send({ content: `<@${member.id}>`, embeds: [embed] });

    } catch (error) {
      console.error(`Error sending welcome message for ${member.id} in ${member.guild.id}:`, error);
    }
  },
};
