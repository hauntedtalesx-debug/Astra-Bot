import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

export default {
  data: new SlashCommandBuilder()
    .setName('dados')
    .setDescription('Gerencia os dados armazenados pela Astra no servidor.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand(subcmd => 
      subcmd.setName('servidor')
        .setDescription('Mostra todos os dados que a Astra possui sobre o servidor')
    )
    .addSubcommand(subcmd => 
      subcmd.setName('apagar')
        .setDescription('Apaga TODOS os dados do servidor permanentemente')
    ),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) return interaction.reply({ content: 'Apenas em servidores.', ephemeral: true });

    if (subcommand === 'servidor') {
      await interaction.deferReply({ ephemeral: true });
      
      const guild = await prisma.guild.findUnique({
        where: { id: guildId },
        include: {
          settings: true,
          _count: {
            select: { members: true, faqs: true, autoPosts: true }
          }
        }
      });

      if (!guild) {
        return interaction.editReply('Astra ainda não está configurada neste servidor. Use `/setup`.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`Dados armazenados - ${guild.name}`)
        .setColor('#3498db')
        .addFields(
          { name: 'Membros no Ranking', value: guild._count.members.toString(), inline: true },
          { name: 'FAQs Cadastradas', value: guild._count.faqs.toString(), inline: true },
          { name: 'Auto-posts Agendados', value: guild._count.autoPosts.toString(), inline: true },
          { name: 'Idioma', value: guild.settings?.language || 'pt-BR', inline: true },
          { name: 'Nicho', value: guild.settings?.niche || 'variedades', inline: true }
        )
        .setFooter({ text: 'Astra Bot - Transparência de dados' });

      await interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === 'apagar') {
      await interaction.deferReply({ ephemeral: true });
      // Remove a guild, cascade removes all related data
      try {
        await prisma.guild.delete({ where: { id: guildId } });
        await interaction.editReply('✅ Todos os dados deste servidor foram apagados com sucesso.');
      } catch (e) {
        await interaction.editReply('❌ Ocorreu um erro ou os dados já não existem.');
      }
    }
  },
};
