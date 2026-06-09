import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';
import { Templates } from '@astra/shared';

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export default {
  data: new SlashCommandBuilder()
    .setName('engajar')
    .setDescription('Comandos rápidos para interagir e engajar a comunidade.')
    
    // PERGUNTA
    .addSubcommand(sub => sub.setName('pergunta').setDescription('Gera uma pergunta rápida para movimentar a comunidade'))

    // ENQUETE
    .addSubcommand(sub => sub.setName('enquete').setDescription('Cria uma enquete interativa')
      .addStringOption(opt => opt.setName('pergunta').setDescription('Qual é a pergunta da enquete?').setRequired(true))
      .addStringOption(opt => opt.setName('opcoes').setDescription('Opções separadas por vírgula (ex: Sim, Não, Talvez)').setRequired(true))
    )

    // DESAFIO
    .addSubcommand(sub => sub.setName('desafio').setDescription('Gera um desafio interativo para a comunidade')),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (!guildId) return interaction.reply({ content: 'Apenas para servidores.', ephemeral: true });

    if (subcommand === 'pergunta') {
      await interaction.deferReply();
      try {
        const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
        const lang = settings?.language || 'pt-BR';
        const niche = settings?.niche || 'variedades';

        const templatesByLang = (Templates.pergunta as any)[lang] || Templates.pergunta['pt-BR'];
        const items = templatesByLang[niche] || templatesByLang['variedades'];
        const question = items[Math.floor(Math.random() * items.length)];

        const embed = new EmbedBuilder()
          .setTitle('🤔 Pergunta do Dia')
          .setColor('#e67e22')
          .setDescription(question)
          .setFooter({ text: 'Responda abaixo!' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply('❌ Erro ao gerar pergunta.');
      }
      return;
    }

    if (subcommand === 'enquete') {
      await interaction.deferReply();
      const question = interaction.options.getString('pergunta', true);
      const optionsRaw = interaction.options.getString('opcoes', true);
      
      const options = optionsRaw.split(',').map(o => o.trim()).filter(o => o.length > 0);

      if (options.length < 2 || options.length > 10) {
        return interaction.editReply('❌ Forneça entre 2 e 10 opções separadas por vírgula.');
      }

      let description = '';
      options.forEach((opt, index) => {
        description += `${numberEmojis[index]} ${opt}\n\n`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`📊 Enquete: ${question}`)
        .setColor('#3498db')
        .setDescription(description)
        .setFooter({ text: 'Reaja abaixo para votar!' });

      const message = await interaction.editReply({ embeds: [embed] });

      for (let i = 0; i < options.length; i++) {
        await message.react(numberEmojis[i]);
      }
      return;
    }

    if (subcommand === 'desafio') {
      await interaction.deferReply();
      try {
        const settings = await prisma.guildSettings.findUnique({ where: { guildId } });
        const lang = settings?.language || 'pt-BR';
        const niche = settings?.niche || 'variedades';

        const templatesByLang = (Templates.desafio as any)[lang] || Templates.desafio['pt-BR'];
        const items = templatesByLang[niche] || templatesByLang['variedades'];
        const challenge = items[Math.floor(Math.random() * items.length)];

        const embed = new EmbedBuilder()
          .setTitle('⚔️ Desafio da Comunidade')
          .setColor('#e74c3c')
          .setDescription(challenge)
          .setFooter({ text: 'Cumpra o desafio no chat!' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply('❌ Erro ao gerar desafio.');
      }
      return;
    }
  },
};
