import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { prisma } from "@astra/db";
import { isAstraAdmin, checkBotPermissions } from "../utils/permissions";
import { checkCooldown } from "../utils/cooldown";
import { isLimitReached } from "../utils/limits";
import { logAudit, AuditLogAction } from "../utils/audit";

export default {
  data: new SlashCommandBuilder()
    .setName("gerenciar")
    .setDescription("Comandos para gerenciar módulos da Astra")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    // LOJA
    .addSubcommandGroup(group => group.setName('loja').setDescription('Gerencia a loja de pontos')
      .addSubcommand(sub => sub.setName('adicionar').setDescription('Adiciona um item')
        .addStringOption(opt => opt.setName('nome').setDescription('Nome do item').setRequired(true))
        .addIntegerOption(opt => opt.setName('preco').setDescription('Preço').setRequired(true))
        .addStringOption(opt => opt.setName('descricao').setDescription('Descrição').setRequired(false))
        .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo associado').setRequired(false)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove um item')
        .addStringOption(opt => opt.setName('id').setDescription('ID do item').setRequired(true)))
      .addSubcommand(sub => sub.setName('painel').setDescription('Envia o painel da loja no canal'))
    )

    // SORTEIO
    .addSubcommandGroup(group => group.setName('sorteio').setDescription('Gerencia sorteios')
      .addSubcommand(sub => sub.setName('criar').setDescription('Cria um sorteio')
        .addStringOption(opt => opt.setName('premio').setDescription('Prêmio').setRequired(true))
        .addStringOption(opt => opt.setName('duracao').setDescription('Duração em horas').setRequired(true))
        .addIntegerOption(opt => opt.setName('vencedores').setDescription('Qtd de vencedores').setRequired(false))
        .addStringOption(opt => opt.setName('descricao').setDescription('Descrição').setRequired(false)))
      .addSubcommand(sub => sub.setName('encerrar').setDescription('Encerra sorteio')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
      .addSubcommand(sub => sub.setName('listar').setDescription('Lista sorteios ativos'))
    )

    // MISSÕES
    .addSubcommandGroup(group => group.setName('missoes').setDescription('Gerencia missões')
      .addSubcommand(sub => sub.setName('criar').setDescription('Cria missão')
        .addStringOption(opt => opt.setName('titulo').setDescription('Título').setRequired(true))
        .addStringOption(opt => opt.setName('descricao').setDescription('O que fazer?').setRequired(true))
        .addIntegerOption(opt => opt.setName('pontos').setDescription('Pontos').setRequired(true))
        .addStringOption(opt => opt.setName('recompensa').setDescription('Recompensa extra').setRequired(false)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove missão')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
      .addSubcommand(sub => sub.setName('listar').setDescription('Lista missões ativas'))
    )

    // ROLES
    .addSubcommandGroup(group => group.setName('roles').setDescription('Painel de cargos por interesse')
      .addSubcommand(sub => sub.setName('adicionar').setDescription('Adiciona cargo ao painel')
        .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true))
        .addStringOption(opt => opt.setName('nome').setDescription('Nome no botão').setRequired(true))
        .addStringOption(opt => opt.setName('descricao').setDescription('Descrição').setRequired(false)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove cargo do painel')
        .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
      .addSubcommand(sub => sub.setName('painel').setDescription('Gera painel de cargos no canal'))
    )

    // TICKET
    .addSubcommandGroup(group => group.setName('ticket').setDescription('Gerencia tickets')
      .addSubcommand(sub => sub.setName('painel').setDescription('Gera painel de tickets no canal'))
    )

    // FAQ
    .addSubcommandGroup(group => group.setName('faq').setDescription('Gerencia as perguntas frequentes')
      .addSubcommand(sub => sub.setName('adicionar').setDescription('Adiciona FAQ')
        .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta').setRequired(true))
        .addStringOption(opt => opt.setName('resposta').setDescription('Resposta').setRequired(true)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove FAQ')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
    )

    // POST
    .addSubcommandGroup(group => group.setName('post').setDescription('Gerencia posts automáticos')
      .addSubcommand(sub => sub.setName('configurar').setDescription('Agenda post')
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(opt => opt.setName('tipo').setDescription('Tipo').setRequired(true).addChoices(
          { name: 'Pergunta', value: 'pergunta' }, { name: 'Enquete', value: 'enquete' }, { name: 'Desafio', value: 'desafio' }
        ))
        .addStringOption(opt => opt.setName('frequencia').setDescription('Frequência').setRequired(true).addChoices(
          { name: 'Diário', value: 'daily' }, { name: 'Semanal', value: 'weekly' }
        ))
        .addStringOption(opt => opt.setName('horario').setDescription('HH:mm').setRequired(true)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove post')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
      .addSubcommand(sub => sub.setName('status').setDescription('Lista posts agendados'))
      .addSubcommand(sub => sub.setName('pausar').setDescription('Pausa posts'))
      .addSubcommand(sub => sub.setName('retomar').setDescription('Retoma posts'))
    )

    // AGENDA
    .addSubcommandGroup(group => group.setName('agenda').setDescription('Gerencia a agenda da comunidade')
      .addSubcommand(sub => sub.setName('adicionar').setDescription('Adiciona evento')
        .addIntegerOption(opt => opt.setName('dia').setDescription('Dia').setRequired(true).addChoices(
          { name: 'Domingo', value: 0 }, { name: 'Segunda', value: 1 }, { name: 'Terça', value: 2 }, { name: 'Quarta', value: 3 }, { name: 'Quinta', value: 4 }, { name: 'Sexta', value: 5 }, { name: 'Sábado', value: 6 }
        ))
        .addStringOption(opt => opt.setName('horario').setDescription('HH:mm').setRequired(true))
        .addStringOption(opt => opt.setName('titulo').setDescription('Título').setRequired(true))
        .addBooleanOption(opt => opt.setName('live').setDescription('É live?').setRequired(false)))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove evento')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
    )

    // YOUTUBE
    .addSubcommandGroup(group => group.setName('youtube').setDescription('Gerencia alertas do YT')
      .addSubcommand(sub => sub.setName('conectar').setDescription('Conecta canal')
        .addStringOption(opt => opt.setName('id_ou_nome').setDescription('ID ou Nome').setRequired(true))
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal no discord').addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand(sub => sub.setName('status').setDescription('Lista canais'))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove canal')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
    )

    // LIVE
    .addSubcommandGroup(group => group.setName('live').setDescription('Gerencia alertas de live')
      .addSubcommand(sub => sub.setName('conectar').setDescription('Conecta alerta')
        .addStringOption(opt => opt.setName('plataforma').setDescription('Twitch/YT/Kick').setRequired(true))
        .addStringOption(opt => opt.setName('username').setDescription('Usuário').setRequired(true))
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal Discord').addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand(sub => sub.setName('status').setDescription('Status das lives'))
      .addSubcommand(sub => sub.setName('remover').setDescription('Remove alerta')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
    )

    // SHORTS
    .addSubcommandGroup(group => group.setName('shorts').setDescription('Ferramenta de ideias para shorts')
      .addSubcommand(sub => sub.setName('ideia').setDescription('Gera uma ideia'))
      .addSubcommand(sub => sub.setName('salvar').setDescription('Salva ideia')
        .addStringOption(opt => opt.setName('titulo').setDescription('Título').setRequired(true))
        .addStringOption(opt => opt.setName('gancho').setDescription('Gancho').setRequired(true))
        .addStringOption(opt => opt.setName('roteiro').setDescription('Roteiro').setRequired(true)))
      .addSubcommand(sub => sub.setName('listar').setDescription('Lista ideias salvas'))
    )

    // CLIPE
    .addSubcommandGroup(group => group.setName('clipe').setDescription('Gerencia clipes da comunidade')
      .addSubcommand(sub => sub.setName('configurar').setDescription('Configura canal aprovados')
        .addChannelOption(opt => opt.setName('canal_aprovados').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand(sub => sub.setName('listar').setDescription('Lista clipes por status')
        .addStringOption(opt => opt.setName('status').setDescription('Status').addChoices(
          { name: 'Pendentes', value: 'PENDING' }, { name: 'Aprovados', value: 'APPROVED' }, { name: 'Rejeitados', value: 'REJECTED' }
        ).setRequired(true)))
      .addSubcommand(sub => sub.setName('aprovar').setDescription('Aprova clipe')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
      .addSubcommand(sub => sub.setName('rejeitar').setDescription('Rejeita clipe')
        .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;

    if (!(await isAstraAdmin(interaction.member as any))) {
      return interaction.reply({ content: "❌ Apenas administradores podem usar /gerenciar.", ephemeral: true });
    }

    // --- LOJA ---
    if (group === 'loja') {
      if (subcommand === 'adicionar') {
        const name = interaction.options.getString('nome', true);
        const price = interaction.options.getInteger('preco', true);
        const desc = interaction.options.getString('descricao');
        const role = interaction.options.getRole('cargo');
        await interaction.deferReply({ ephemeral: true });
        const item = await prisma.storeItem.create({ data: { guildId, name, price, description: desc, roleId: role?.id } });
        return interaction.editReply(`✅ Item adicionado. ID: \`${item.id}\``);
      }
      if (subcommand === 'remover') {
        const id = interaction.options.getString('id', true);
        await interaction.deferReply({ ephemeral: true });
        try { await prisma.storeItem.delete({ where: { id, guildId } }); return interaction.editReply('🗑️ Removido.'); }
        catch { return interaction.editReply('❌ Não encontrado.'); }
      }
      if (subcommand === 'painel') {
        const items = await prisma.storeItem.findMany({ where: { guildId, active: true }, orderBy: { price: 'asc' } });
        if (items.length === 0) return interaction.reply({ content: 'Loja vazia.', ephemeral: true });
        const embed = new EmbedBuilder().setTitle("🛒 Loja").setColor("#FF8C00");
        items.forEach(i => embed.addFields({ name: `${i.name} — 💰 ${i.price}`, value: i.description || 'Sem descrição' }));
        const options = items.map(i => ({ label: i.name, description: `Custa ${i.price} pontos`, value: `buy_${i.id}` }));
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder().setCustomId('shop_select').setPlaceholder('Comprar...').addOptions(options)
        );
        await (interaction.channel as any)?.send({ embeds: [embed], components: [row] });
        return interaction.reply({ content: 'Enviado.', ephemeral: true });
      }
    }

    // --- SORTEIO ---
    if (group === 'sorteio') {
      if (subcommand === 'criar') {
        const prize = interaction.options.getString('premio', true);
        const hours = parseFloat(interaction.options.getString('duracao', true));
        const winners = interaction.options.getInteger('vencedores') || 1;
        const desc = interaction.options.getString('descricao');
        await interaction.deferReply({ ephemeral: true });
        const endAt = new Date(Date.now() + hours * 3600000);
        const embed = new EmbedBuilder().setTitle(`🎉 Sorteio: ${prize}`).setColor("#FFD700")
          .setDescription(`${desc ? desc+'\n' : ''}Reaja com 🎉\nVencedores: ${winners}\nTermina <t:${Math.floor(endAt.getTime()/1000)}:R>`);
        const msg = await (interaction.channel as any)?.send({ embeds: [embed] });
        if (msg) {
          await msg.react("🎉");
          await prisma.giveaway.create({ data: { guildId, title: prize, prize, description: desc, winnersCount: winners, endAt, channelId: msg.channel.id, messageId: msg.id }});
        }
        return interaction.editReply('✅ Sorteio criado.');
      }
      if (subcommand === 'encerrar') {
        const id = interaction.options.getString('id', true);
        await interaction.deferReply({ ephemeral: true });
        await prisma.giveaway.update({ where: { id }, data: { active: false, endAt: new Date() } });
        return interaction.editReply('✅ Sorteio encerrado.');
      }
      if (subcommand === 'listar') {
        await interaction.deferReply({ ephemeral: true });
        const gs = await prisma.giveaway.findMany({ where: { guildId, active: true } });
        const embed = new EmbedBuilder().setTitle("🎉 Ativos").setDescription(gs.length ? gs.map(g => `ID: \`${g.id}\` | ${g.prize}`).join('\n') : 'Nenhum.');
        return interaction.editReply({ embeds: [embed] });
      }
    }

    // --- MISSOES ---
    if (group === 'missoes') {
      if (subcommand === 'criar') {
        await interaction.deferReply({ ephemeral: true });
        const m = await prisma.communityMission.create({ data: { guildId, title: interaction.options.getString('titulo', true), description: interaction.options.getString('descricao', true), points: interaction.options.getInteger('pontos', true), reward: interaction.options.getString('recompensa') } });
        return interaction.editReply(`✅ Criada. ID: \`${m.id}\``);
      }
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.communityMission.delete({ where: { id: interaction.options.getString('id', true) } });
        return interaction.editReply('✅ Removida.');
      }
      if (subcommand === 'listar') {
        await interaction.deferReply();
        const ms = await prisma.communityMission.findMany({ where: { guildId, active: true } });
        const embed = new EmbedBuilder().setTitle("🎯 Missões").setDescription(ms.length ? ms.map(m => `**${m.title}** (${m.points} pts)\n${m.description} \nID: \`${m.id}\``).join('\n\n') : 'Nenhuma.');
        return interaction.editReply({ embeds: [embed] });
      }
    }

    // --- ROLES ---
    if (group === 'roles') {
      if (subcommand === 'adicionar') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.autoRole.upsert({ where: { guildId_roleId: { guildId, roleId: interaction.options.getRole('cargo', true).id } }, update: { name: interaction.options.getString('nome', true), description: interaction.options.getString('descricao') }, create: { guildId, roleId: interaction.options.getRole('cargo', true).id, name: interaction.options.getString('nome', true), description: interaction.options.getString('descricao') } });
        return interaction.editReply('✅ Adicionado.');
      }
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.autoRole.delete({ where: { guildId_roleId: { guildId, roleId: interaction.options.getRole('cargo', true).id } } });
        return interaction.editReply('✅ Removido.');
      }
      if (subcommand === 'painel') {
        await interaction.deferReply({ ephemeral: true });
        const roles = await prisma.autoRole.findMany({ where: { guildId } });
        if (!roles.length) return interaction.editReply('Sem cargos.');
        const embed = new EmbedBuilder().setTitle("🎭 Cargos por Interesse").setDescription(roles.map(r => `**${r.name}** - <@&${r.roleId}>`).join('\n'));
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(roles.slice(0, 5).map(r => new ButtonBuilder().setCustomId(`autorole_${r.roleId}`).setLabel(r.name).setStyle(ButtonStyle.Primary)));
        await (interaction.channel as any)?.send({ embeds: [embed], components: [row] });
        return interaction.editReply('Enviado.');
      }
    }

    // --- TICKET ---
    if (group === 'ticket' && subcommand === 'painel') {
      await interaction.deferReply({ ephemeral: true });
      const embed = new EmbedBuilder().setTitle("🎫 Central de Atendimento").setDescription("Clique no botão abaixo para abrir um ticket.");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId("ticket_open").setLabel("Abrir Ticket").setStyle(ButtonStyle.Primary).setEmoji("🎫"));
      await (interaction.channel as any)?.send({ embeds: [embed], components: [row] });
      return interaction.editReply('Painel enviado.');
    }

    // --- FAQ ---
    if (group === 'faq') {
      if (subcommand === 'adicionar') {
        await interaction.deferReply({ ephemeral: true });
        const f = await prisma.fAQItem.create({ data: { guildId, question: interaction.options.getString('pergunta', true), answer: interaction.options.getString('resposta', true) } });
        return interaction.editReply(`✅ Adicionado. ID: \`${f.id}\``);
      }
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.fAQItem.deleteMany({ where: { id: interaction.options.getString('id', true), guildId } });
        return interaction.editReply('🗑️ Removido.');
      }
    }

    // --- POST ---
    if (group === 'post') {
      if (subcommand === 'configurar') {
        await interaction.deferReply({ ephemeral: true });
        const p = await prisma.autoPostSchedule.create({ data: { guildId, channelId: interaction.options.getChannel('canal', true).id, type: interaction.options.getString('tipo', true), frequency: interaction.options.getString('frequencia', true), time: interaction.options.getString('horario', true) } });
        return interaction.editReply(`✅ Configurado. ID: \`${p.id}\``);
      }
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.autoPostSchedule.deleteMany({ where: { id: interaction.options.getString('id', true), guildId } });
        return interaction.editReply('🗑️ Removido.');
      }
      if (subcommand === 'status') {
        await interaction.deferReply({ ephemeral: true });
        const ps = await prisma.autoPostSchedule.findMany({ where: { guildId } });
        return interaction.editReply(ps.length ? ps.map(p => `ID: \`${p.id}\` | ${p.type} às ${p.time}`).join('\n') : 'Nenhum.');
      }
      if (subcommand === 'pausar') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.guildSettings.upsert({ where: { guildId }, update: { autoPostPaused: true }, create: { guildId, autoPostPaused: true }});
        return interaction.editReply('⏸️ Pausado.');
      }
      if (subcommand === 'retomar') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.guildSettings.upsert({ where: { guildId }, update: { autoPostPaused: false }, create: { guildId, autoPostPaused: false }});
        return interaction.editReply('▶️ Retomado.');
      }
    }

    // --- AGENDA ---
    if (group === 'agenda') {
      if (subcommand === 'adicionar') {
        await interaction.deferReply({ ephemeral: true });
        const a = await prisma.creatorSchedule.create({ data: { guildId, dayOfWeek: interaction.options.getInteger('dia', true), time: interaction.options.getString('horario', true), title: interaction.options.getString('titulo', true), isLive: interaction.options.getBoolean('live') || false }});
        return interaction.editReply(`✅ Adicionado. ID: \`${a.id}\``);
      }
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.creatorSchedule.deleteMany({ where: { id: interaction.options.getString('id', true), guildId }});
        return interaction.editReply('✅ Removido.');
      }
    }

    // --- YOUTUBE & LIVE ---
    if (group === 'youtube' || group === 'live') {
      if (subcommand === 'remover') {
        await interaction.deferReply({ ephemeral: true });
        if (group === 'youtube') await prisma.youtubeIntegration.deleteMany({ where: { id: interaction.options.getString('id', true), guildId } });
        else await prisma.creatorIntegration.deleteMany({ where: { id: interaction.options.getString('id', true), guildId } });
        return interaction.editReply('🗑️ Removido.');
      }
      if (subcommand === 'status') {
        await interaction.deferReply({ ephemeral: true });
        let text = '';
        if (group === 'youtube') {
          const ys = await prisma.youtubeIntegration.findMany({ where: { guildId } });
          text = ys.map(y => `ID: \`${y.id}\` | ${y.youtubeChannelName}`).join('\n');
        } else {
          const ls = await prisma.creatorIntegration.findMany({ where: { guildId } });
          text = ls.map(l => `ID: \`${l.id}\` | ${l.creatorUsername} (${l.platform})`).join('\n');
        }
        return interaction.editReply(text || 'Nenhum.');
      }
      if (subcommand === 'conectar') {
        await interaction.deferReply({ ephemeral: true });
        if (group === 'youtube') {
          const y = await prisma.youtubeIntegration.create({ data: { guildId, youtubeChannelId: interaction.options.getString('id_ou_nome', true), youtubeChannelName: interaction.options.getString('id_ou_nome', true), discordChannelId: interaction.options.getChannel('canal', true).id }});
          return interaction.editReply(`✅ Conectado. ID: \`${y.id}\``);
        } else {
          const l = await prisma.creatorIntegration.create({ data: { guildId, platform: interaction.options.getString('plataforma', true), creatorUsername: interaction.options.getString('username', true), discordChannelId: interaction.options.getChannel('canal', true).id }});
          return interaction.editReply(`✅ Conectado. ID: \`${l.id}\``);
        }
      }
    }

    // --- SHORTS ---
    if (group === 'shorts') {
      if (subcommand === 'salvar') {
        await interaction.deferReply({ ephemeral: true });
        const s = await prisma.shortIdea.create({ data: { guildId, createdBy: interaction.user.id, title: interaction.options.getString('titulo', true), hook: interaction.options.getString('gancho', true), script: interaction.options.getString('roteiro', true), niche: "variedades" }});
        return interaction.editReply(`✅ Salvo. ID: \`${s.id}\``);
      }
      if (subcommand === 'listar') {
        await interaction.deferReply({ ephemeral: true });
        const is = await prisma.shortIdea.findMany({ where: { guildId }, take: 5, orderBy: { createdAt: 'desc' } });
        return interaction.editReply(is.length ? is.map(i => `ID: \`${i.id}\` | **${i.title}**`).join('\n') : 'Nenhuma.');
      }
      if (subcommand === 'ideia') {
        return interaction.reply({ content: 'Ideia: Faça um short sobre o Astra Bot!', ephemeral: true });
      }
    }

    // --- CLIPE ---
    if (group === 'clipe') {
      if (subcommand === 'configurar') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.clipSettings.upsert({ where: { guildId }, update: { approvedChannelId: interaction.options.getChannel('canal_aprovados', true).id }, create: { guildId, approvedChannelId: interaction.options.getChannel('canal_aprovados', true).id }});
        return interaction.editReply('✅ Configurado.');
      }
      if (subcommand === 'listar') {
        await interaction.deferReply({ ephemeral: true });
        const cs = await prisma.clipSubmission.findMany({ where: { guildId, status: interaction.options.getString('status', true) }, take: 10 });
        return interaction.editReply(cs.length ? cs.map(c => `ID: \`${c.id}\` | ${c.url}`).join('\n') : 'Nenhum.');
      }
      if (subcommand === 'aprovar' || subcommand === 'rejeitar') {
        await interaction.deferReply({ ephemeral: true });
        await prisma.clipSubmission.update({ where: { id: interaction.options.getString('id', true) }, data: { status: subcommand === 'aprovar' ? 'APPROVED' : 'REJECTED' }});
        return interaction.editReply(`✅ ${subcommand === 'aprovar' ? 'Aprovado' : 'Rejeitado'}.`);
      }
    }
  },
};
