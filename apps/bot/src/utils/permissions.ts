import { ChatInputCommandInteraction, PermissionResolvable, PermissionsBitField, GuildMember } from "discord.js";

/**
 * Checks if the bot has the required permissions in the channel.
 * If not, it replies to the interaction with an error message and returns false.
 */
export async function checkBotPermissions(
  interaction: ChatInputCommandInteraction,
  requiredPermissions: PermissionResolvable[]
): Promise<boolean> {
  if (!interaction.guild || !interaction.channel) return false;

  const botMember = interaction.guild.members.me;
  if (!botMember) return false;

  const missingPermissions: string[] = [];

  for (const perm of requiredPermissions) {
    if (!interaction.channel.permissionsFor(botMember).has(perm)) {
      missingPermissions.push(new PermissionsBitField(perm).toArray()[0]);
    }
  }

  if (missingPermissions.length > 0) {
    const errorMessage = `❌ A Astra não tem as permissões necessárias neste canal para executar esta ação.\n\nFaltam as seguintes permissões: \`${missingPermissions.join(", ")}\``;
    
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
    return false;
  }

  return true;
}

/**
 * Checks if the user is an Astra Admin (Server Admin or has the configured Astra Admin Role).
 */
export async function isAstraAdmin(member: GuildMember, configuredRoleId?: string | null): Promise<boolean> {
  if (member.permissions.has("Administrator")) return true;
  if (configuredRoleId && member.roles.cache.has(configuredRoleId)) return true;
  return false;
}
