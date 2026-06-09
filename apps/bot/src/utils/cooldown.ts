import { Collection } from "discord.js";

// Collection to store cooldowns. Map<commandName, Map<userId_or_guildId, timestamp>>
const cooldowns = new Collection<string, Collection<string, number>>();

/**
 * Checks if an entity (user or guild) is on cooldown for a specific command.
 * @param commandName The name of the command or action.
 * @param id The ID of the user or guild.
 * @param cooldownAmount The cooldown duration in milliseconds.
 * @returns An object containing `onCooldown` (boolean) and `timeLeft` (number in ms) if on cooldown.
 */
export function checkCooldown(commandName: string, id: string, cooldownAmount: number): { onCooldown: boolean; timeLeft?: number } {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const timestamps = cooldowns.get(commandName)!;
  const now = Date.now();

  if (timestamps.has(id)) {
    const expirationTime = timestamps.get(id)! + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = expirationTime - now;
      return { onCooldown: true, timeLeft };
    }
  }

  timestamps.set(id, now);
  setTimeout(() => timestamps.delete(id), cooldownAmount);

  return { onCooldown: false };
}
