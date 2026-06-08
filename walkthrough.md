# 🌟 Astra Bot - Walkthrough do MVP

Projeto concluído! Eu desenvolvi o MVP completo da Astra, uma assistente de comunidade em formato de SaaS multi-servidor construída com Turborepo.

Abaixo está o resumo técnico e visual de tudo o que foi implementado na estrutura.

## 🏗️ Estrutura do Monorepo

O código foi organizado em um workspace escalável usando **pnpm** e **Turborepo**:

*   **`packages/db`**: Contém o schema do Prisma com 11 tabelas. 
    *   Gerencia os modelos `User` e `Session` para o NextAuth.
    *   Gerencia `Guild`, `GuildSettings`, `AutoPostSchedule`, `MemberActivity` e `FAQItem` para o funcionamento do bot.
    *   Possui um arquivo `seed.ts` para popular automaticamente os planos Free, Pro e Creator.
*   **`packages/shared`**: Centraliza os utilitários, incluindo a biblioteca local de **templates JSON de auto-posts** organizados por nicho (Games, Anime, Tecnologia, Variedades) e idioma (pt-BR, en-US).
*   **`apps/bot`**: Aplicação em Node.js usando `discord.js` v14.
*   **`apps/web`**: Dashboard moderno em Next.js (App Router) e Tailwind CSS.

---

## 🤖 O Bot (Discord.js)

O bot está totalmente componentizado, com **Event Handlers** e **Slash Commands** dinâmicos.

### 🛡️ Comandos Slash Criados:
1.  `/setup`: Configura canais (post, log, ranking), idioma e nicho. Salva as infos vinculando ao `GuildId` no PostgreSQL.
2.  `/ajuda`: Mostra um Embed interativo e inclui botões com links para o Suporte e Dashboard.
3.  `/dados`: Exclusivo para administradores.
    *   `/dados servidor`: Mostra uma prévia limpa dos dados armazenados sobre o servidor atual.
    *   `/dados apagar`: Deleta a guilda do banco (removendo em cascata FAQs, ranking, etc).
4.  `/faq`: Gerenciador de Q&A.
    *   `/faq adicionar` e `/faq listar`.
    *   `/faq perguntar`: Faz uma busca de similaridade básica de strings entre a pergunta feita pelo usuário e as cadastradas pelo dono do servidor.
5.  `/ranking`: Retorna um Embed com os 10 membros mais ativos usando a tabela `MemberActivity`.
6.  `/astra-post`: Sistema que interage com o Cron Job.
    *   Agenda posts escolhendo canal, tipo (enquete, pergunta, etc) e frequência diária/semanal.
7.  `/plano`: Busca do banco o status atual da assinatura do servidor.

### 🧠 Sistema Anti-Spam (Ranking)
O evento `messageCreate` implementa um filtro poderoso:
*   Ignora mensagens curtas (menos de 5 caracteres).
*   Ignora bots e mensagens em DMs.
*   Possui um **Cooldown Rate Limit** em memória (`Map`) de 60 segundos por usuário (para evitar floods pontuarem muito rápido).
*   Consulta a tabela `IgnoredChannel` para não pontuar em chats administrativos.

---

## 💻 Dashboard Web (Next.js)

O Dashboard conta com uma identidade visual premium, focada no "Dark Mode" absoluto com tons em púrpura e azul (`#0f0c29`, `#8e44ad`).

### 🔑 Autenticação
Implementado o **Auth.js** (antigo NextAuth) v5 Beta configurado diretamente com o **Discord Provider**. O Prisma Adapter já está cuidando das sessões.

### 🚀 Páginas
*   **Página Inicial (`/page.tsx`)**: Uma landing page imersiva focada em conversão, explicando os recursos (Posts, Ranking, FAQ) e os planos Free, Pro e Creator.
*   **Páginas Legais (`/privacy` e `/terms`)**: Documentos básicos para estar de acordo com as regras de verificação do Discord App.
*   **Lista de Servidores (`/dashboard/page.tsx`)**: Mapeia as guildas do banco atreladas ao `ownerId` e mostra de forma limpa onde a Astra está instalada.
*   **Guild Dashboard (`/dashboard/[guildId]/page.tsx`)**: Painel métrico com botões de acesso rápido às configurações individuais do servidor selecionado.

---

## 🚀 Como Executar

No diretório raiz `astra`, criamos o arquivo `.env.example` e um `README.md` extensivo que guia você ou qualquer desenvolvedor nos próximos passos.

> [!TIP]
> **Começando agora:**
> 1. Copie o `.env.example` para `.env` e preencha o token do seu bot.
> 2. Rode `pnpm run db:push` na pasta `packages/db` para criar as tabelas localmente.
> 3. Na raiz, rode `pnpm run dev` para iniciar tanto o site quanto o bot via Turborepo!

> [!IMPORTANT]
> A implementação cumpriu exatamente o prometido no MVP, sendo totalmente local (sem dependência imediata de IA paga). Os templates locais já funcionam e a arquitetura está preparada para expansão com APIs como a OpenAI no futuro através do `.env`.
