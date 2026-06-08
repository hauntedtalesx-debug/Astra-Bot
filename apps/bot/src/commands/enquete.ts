import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '@astra/db';

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export default {
  data: new SlashCommandBuilder()
    .setName('enquete')
    .setDescription('Cria uma enquete interativa')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Qual é a pergunta da enquete?').setRequired(true))
    .addStringOption(opt => opt.setName('opcoes').setDescription('Opções separadas por vírgula (ex: Sim, Não, Talvez)').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
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

    // React with emojis
    for (let i = 0; i < options.length; i++) {
      await message.react(numberEmojis[i]);
    }
  },
};
