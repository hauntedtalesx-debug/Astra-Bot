# Astra Bot & Dashboard 🌟

Astra é uma gerente de comunidade com IA projetada para streamers e criadores de conteúdo. Este projeto é um SaaS multi-servidor construído com um monorepo (Turborepo).

## Tecnologias

- **Bot**: Node.js, TypeScript, Discord.js v14
- **Web**: Next.js (App Router), Tailwind CSS, Auth.js (Discord OAuth2)
- **Banco de Dados**: PostgreSQL, Prisma ORM
- **Gerenciador de Pacotes**: pnpm

## Estrutura do Monorepo

- `apps/bot`: O bot do Discord.
- `apps/web`: O dashboard Next.js.
- `packages/db`: O banco de dados centralizado e os schemas Prisma.
- `packages/shared`: Tipos comuns, templates e lógicas compartilhadas.

## Como rodar localmente

1. Instale o `pnpm` globalmente: `npm install -g pnpm`
2. Clone o repositório e rode `pnpm install` na raiz.
3. Copie o `.env.example` para `.env` e preencha as variáveis, incluindo as chaves do Discord Developer Portal e a URL do PostgreSQL.
4. Execute as migrations do banco de dados: `cd packages/db && pnpm run db:push`
5. Popule o banco com os planos de assinatura: `cd packages/db && pnpm run db:seed`
6. Registre os Slash Commands: `cd apps/bot && pnpm run register`
7. Inicie todo o projeto a partir da raiz: `pnpm run dev`

O dashboard estará disponível em `http://localhost:3000`.

## Configurando no Discord Developer Portal

1. Crie uma aplicação em [Discord Developer Portal](https://discord.com/developers/applications).
2. Pegue o `Client ID` e o `Client Secret` (para o NextAuth) e coloque no `.env`.
3. Na aba "Bot", habilite as Intents de **Server Members** e **Message Content**.
4. Pegue o Token do Bot e coloque na variável `DISCORD_BOT_TOKEN`.
5. Em OAuth2 -> Redirects, adicione `http://localhost:3000/api/auth/callback/discord` para desenvolvimento local.

## Deploy em Produção

### Banco de Dados (Supabase/Neon)
1. Crie um projeto em um desses provedores e pegue a Connection String (PostgreSQL).
2. Coloque essa string na variável `DATABASE_URL` do seu provedor de hospedagem.

### Dashboard Web (Vercel)
1. Conecte o repositório na Vercel.
2. Defina o Root Directory como `apps/web` ou deixe na raiz (a Vercel entende Turborepo).
3. Adicione as variáveis de ambiente necessárias (incluindo `AUTH_SECRET`).

### Bot (Render, Railway, ou VPS)
1. Conecte o repositório no provedor de sua escolha.
2. Defina o comando de build: `pnpm run build`
3. Defina o comando de start: `cd apps/bot && pnpm start`
4. Adicione as variáveis de ambiente.

## Próximos Passos (Futuro)
- Integrações diretas de notificação de live com Twitch e YouTube.
- Integração de pagamentos usando Discord App Monetization ou Stripe.
