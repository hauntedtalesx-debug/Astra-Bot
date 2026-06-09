import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '@astra/db';
import { createAstraEmbed } from './embeds';

interface EmbedVariables {
  user?: string;
  username?: string;
  server?: string;
  memberCount?: string;
  creator?: string;
  liveTitle?: string;
  liveUrl?: string;
  youtubeTitle?: string;
  youtubeUrl?: string;
  rankingTop1?: string;
  level?: string;
  xp?: string;
  coins?: string;
  pet?: string;
  date?: string;
  time?: string;
}

export const DEFAULT_TEMPLATES: Record<string, any> = {
  WELCOME: {
    title: 'Bem-vindo(a) à comunidade!',
    description: 'Olá {user}, seja muito bem-vindo(a) ao **{server}**! Sinta-se em casa.',
    color: '#8b5cf6',
  },
  LIVE_ONLINE: {
    title: '🔴 A live começou!',
    description: 'O(a) {creator} acabou de ficar online! Vem colar com a gente:\n\n{liveUrl}',
    color: '#e74c3c',
  },
  YOUTUBE_NEW: {
    title: '📺 Vídeo Novo no Ar!',
    description: 'Temos um novo vídeo: **{youtubeTitle}**\n\nAssista agora: {youtubeUrl}',
    color: '#e74c3c',
  },
  RANKING_WEEKLY: {
    title: '🏆 Ranking da Semana',
    description: 'Parabéns ao nosso membro mais ativo da semana: {rankingTop1}!',
    color: '#f1c40f',
  },
  LEVEL_UP: {
    title: '🌟 Subiu de Nível!',
    description: 'Parabéns {user}, você acaba de alcançar o Nível {level}!',
    color: '#10b981',
  },
  DAILY_REWARD: {
    title: '🎁 Recompensa Diária',
    description: '{user} resgatou sua recompensa de {coins} Stardust!',
    color: '#3498db',
  },
  ERROR: {
    title: '❌ Ops, ocorreu um erro',
    description: 'Não foi possível completar essa ação.',
    color: '#ef4444',
  },
  SUCCESS: {
    title: '✅ Sucesso',
    description: 'Ação completada com sucesso.',
    color: '#10b981',
  }
};

/**
 * Substitui as variáveis {chave} pelo valor real
 */
function parseVariables(text: string | null | undefined, vars: EmbedVariables): string | null {
  if (!text) return null;
  let parsed = text;
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) {
      const regex = new RegExp(`{${key}}`, 'g');
      parsed = parsed.replace(regex, value);
    }
  }
  return parsed;
}

/**
 * Compila o Embed final usando o DB ou Default + Variáveis
 */
export async function compileEmbed(guildId: string, templateKey: string, variables: EmbedVariables) {
  // 1. Buscar do banco
  const custom = await prisma.customEmbedTemplate.findUnique({
    where: { guildId_templateKey: { guildId, templateKey } }
  });

  // 2. Fallback para default
  const defaultTpl = DEFAULT_TEMPLATES[templateKey] || DEFAULT_TEMPLATES.SUCCESS;

  // 3. Mesclar (Custom sobrepõe Default)
  const template = {
    title: custom?.title ?? defaultTpl.title,
    description: custom?.description ?? defaultTpl.description,
    color: custom?.color ?? defaultTpl.color,
    imageUrl: custom?.imageUrl,
    thumbnailUrl: custom?.thumbnailUrl,
    authorName: custom?.authorName,
    authorIconUrl: custom?.authorIconUrl,
    footerText: custom?.footerText,
    footerIconUrl: custom?.footerIconUrl,
    buttonLabel: custom?.buttonLabel,
    buttonUrl: custom?.buttonUrl,
  };

  // 4. Parsear variáveis
  const title = parseVariables(template.title, variables);
  const description = parseVariables(template.description, variables);
  const authorName = parseVariables(template.authorName, variables);
  const footerText = parseVariables(template.footerText, variables);
  const buttonLabel = parseVariables(template.buttonLabel, variables);
  const buttonUrl = parseVariables(template.buttonUrl, variables);

  // 5. Construir o Embed do Discord
  const embed = createAstraEmbed();
  
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (template.color) embed.setColor(template.color as any);
  
  if (template.imageUrl) embed.setImage(template.imageUrl);
  if (template.thumbnailUrl) embed.setThumbnail(template.thumbnailUrl);
  
  if (authorName) embed.setAuthor({ name: authorName, iconURL: template.authorIconUrl || undefined });
  
  if (footerText) embed.setFooter({ text: footerText, iconURL: template.footerIconUrl || undefined });

  // 6. Construir Botões (se existirem)
  const components: any[] = [];
  if (buttonLabel && buttonUrl) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(buttonLabel)
        .setURL(buttonUrl)
        .setStyle(ButtonStyle.Link)
    );
    components.push(row);
  }

  return { embeds: [embed], components };
}
