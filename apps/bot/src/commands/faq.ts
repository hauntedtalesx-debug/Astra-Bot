import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Sistema inteligente de Perguntas e Respostas')
    .addSubcommand(subcmd => 
      subcmd.setName('adicionar')
        .setDescription('Adiciona uma nova pergunta frequente (Apenas Admins)')
        .addStringOption(opt => opt.setName('pergunta').setDescription('A pergunta').setRequired(true))
        .addStringOption(opt => opt.setName('resposta').setDescription('A resposta').setRequired(true))
    )
    .addSubcommand(subcmd => 
      subcmd.setName('perguntar')
        .setDescription('Faz uma pergunta para a Astra')
        .addStringOption(opt => opt.setName('duvida').setDescription('O que você quer saber?').setRequired(true))
    )
    .addSubcommand(subcmd => 
      subcmd.setName('listar')
        .setDescription('Lista todas as perguntas frequentes cadastradas')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('remover')
        .setDescription('Remove uma pergunta frequente (Apenas Admins)')
        .addStringOption(opt => opt.setName('id').setDescription('ID do FAQ (veja no /faq listar)').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) return interaction.reply({ content: 'Comando apenas para servidores.', ephemeral: true });

    if (subcommand === 'adicionar' || subcommand === 'remover') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Você não tem permissão.', ephemeral: true });
      }
    }

    if (subcommand === 'adicionar') {
      const question = interaction.options.getString('pergunta')!;
      const answer = interaction.options.getString('resposta')!;

      await interaction.deferReply({ ephemeral: true });
      try {
        await prisma.fAQItem.create({
          data: { guildId, question, answer }
        });
        await interaction.editReply('✅ FAQ adicionado com sucesso!');
      } catch (error) {
        await interaction.editReply('❌ Erro ao adicionar o FAQ.');
      }
    }

    if (subcommand === 'remover') {
      const id = interaction.options.getString('id')!;
      await interaction.deferReply({ ephemeral: true });
      try {
        await prisma.fAQItem.deleteMany({
          where: { id, guildId }
        });
        await interaction.editReply('🗑️ FAQ removido com sucesso!');
      } catch (error) {
        await interaction.editReply('❌ Erro ao remover o FAQ. ID não encontrado.');
      }
    }

    if (subcommand === 'listar') {
      await interaction.deferReply();
      const faqs = await prisma.fAQItem.findMany({ where: { guildId } });
      
      if (faqs.length === 0) return interaction.editReply('Nenhum FAQ cadastrado.');

      const embed = new EmbedBuilder().setTitle('❓ FAQ - Perguntas Frequentes').setColor('#2ecc71');
      faqs.slice(0, 10).forEach(f => {
        embed.addFields({ name: `[ID: ${f.id}] ${f.question}`, value: f.answer.substring(0, 1000) });
      });

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === 'perguntar') {
      const duvida = interaction.options.getString('duvida')!;
      await interaction.deferReply();

      // Busca simples por similaridade de texto usando includes ou similar (IA pode ser integrada aqui)
      const faqs = await prisma.fAQItem.findMany({ where: { guildId } });
      const words = duvida.toLowerCase().split(' ');
      
      let bestMatch = null;
      let highestScore = 0;

      for (const faq of faqs) {
        const qWords = faq.question.toLowerCase().split(' ');
        let score = words.filter(w => qWords.includes(w) && w.length > 3).length;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      }

      if (bestMatch && highestScore > 0) {
        const embed = new EmbedBuilder()
          .setTitle('Resposta encontrada')
          .setColor('#9b59b6')
          .addFields(
            { name: 'Pergunta Similar', value: bestMatch.question },
            { name: 'Resposta', value: bestMatch.answer }
          );
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.editReply('Não encontrei nenhuma resposta no FAQ para essa pergunta. Consulte um moderador!');
      }
    }
  },
};
