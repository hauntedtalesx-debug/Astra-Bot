import { EmbedBuilder } from 'discord.js';

export const ASTRA_COLORS = {
  primary: '#8b5cf6', // Roxo Cósmico
  success: '#10b981', // Verde
  error: '#ef4444',   // Vermelho
  warning: '#f59e0b', // Laranja
  info: '#3b82f6',    // Azul
  premium: '#ec4899', // Rosa
};

export const ASTRA_FOOTER = {
  text: 'Astra • Community OS',
  iconURL: 'https://i.imgur.com/xO9W7V3.png', // Replace with actual Astra icon if available
};

/**
 * Cria o Embed Base Padrão da Astra
 */
export function createAstraEmbed() {
  return new EmbedBuilder()
    .setColor(ASTRA_COLORS.primary)
    .setFooter(ASTRA_FOOTER)
    .setTimestamp();
}

/**
 * Cria um Embed de Sucesso
 */
export function createSuccessEmbed(title: string, description: string) {
  return createAstraEmbed()
    .setColor(ASTRA_COLORS.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description);
}

/**
 * Cria um Embed de Erro
 */
export function createErrorEmbed(title: string, description: string) {
  return createAstraEmbed()
    .setColor(ASTRA_COLORS.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description);
}

/**
 * Cria um Embed de Aviso
 */
export function createWarningEmbed(title: string, description: string) {
  return createAstraEmbed()
    .setColor(ASTRA_COLORS.warning)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description);
}

/**
 * Cria um Embed de Informação
 */
export function createInfoEmbed(title: string, description: string) {
  return createAstraEmbed()
    .setColor(ASTRA_COLORS.info)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description);
}

/**
 * Cria um Embed Premium (Astra Premium)
 */
export function createPremiumEmbed(title: string, description: string) {
  return createAstraEmbed()
    .setColor(ASTRA_COLORS.premium)
    .setTitle(`✨ ${title}`)
    .setDescription(description);
}
