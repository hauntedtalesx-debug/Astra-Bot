export const autoPostTemplates = {
  "pt-BR": {
    games: [
      { type: "pergunta", content: "Qual jogo você não consegue parar de jogar ultimamente?" },
      { type: "desafio", content: "Mande um print da sua tela de vitórias (ou derrotas) mais recente!" },
      { type: "enquete", content: "Qual deve ser o próximo jogo da live?\n1. RPG\n2. FPS\n3. Terror\n4. Indie" },
      { type: "meme", content: "Aquele momento que o boss está com 1% de HP e o controle desconecta... Reaja com um emoji que define esse sentimento!" }
    ],
    anime: [
      { type: "pergunta", content: "Qual anime da temporada você está acompanhando e recomenda?" },
      { type: "desafio", content: "Mande o wallpaper do seu anime favorito!" },
      { type: "enquete", content: "Qual estilo de anime você prefere ver discutido na próxima live?\n1. Shounen\n2. Isekai\n3. Slice of Life\n4. Seinen" },
      { type: "meme", content: "Descreva seu protagonista favorito usando apenas 3 emojis!" }
    ],
    tech: [
      { type: "pergunta", content: "Qual é a sua linguagem de programação favorita e por quê?" },
      { type: "desafio", content: "Mande uma foto do seu setup de trabalho/estudos!" },
      { type: "enquete", content: "Qual tema de tecnologia você gostaria de ver na próxima live?\n1. Inteligência Artificial\n2. Desenvolvimento Web\n3. Hardware\n4. Cibersegurança" },
      { type: "meme", content: "Quando o código compila de primeira sem erros... Qual é a sua reação?" }
    ],
    variedades: [
      { type: "pergunta", content: "Qual foi a melhor parte do seu dia hoje?" },
      { type: "desafio", content: "Qual música não sai da sua cabeça hoje? Mande o link!" },
      { type: "enquete", content: "O que você gostaria de ver na live essa semana?\n1. Reacts\n2. Gameplay relaxante\n3. Bate-papo\n4. Assistir algo juntos" },
      { type: "meme", content: "A live cai do nada. Qual meme te representa nesse momento?" }
    ]
  },
  "en-US": {
    games: [
      { type: "pergunta", content: "What game are you currently addicted to?" },
      { type: "desafio", content: "Drop a screenshot of your most recent victory (or fail) screen!" },
      { type: "enquete", content: "What should we play next stream?\n1. RPG\n2. FPS\n3. Horror\n4. Indie" },
      { type: "meme", content: "When the boss is at 1% HP and your controller disconnects... React with an emoji that describes this feeling!" }
    ],
    variety: [
      { type: "pergunta", content: "What was the best part of your day today?" },
      { type: "desafio", content: "What song is stuck in your head today? Share the link!" },
      { type: "enquete", content: "What do you want to see on stream this week?\n1. Reacts\n2. Chill gameplay\n3. Just Chatting\n4. Watch party" },
      { type: "meme", content: "The stream goes offline suddenly. What meme represents you right now?" }
    ]
  },
  "es-ES": {
    variedades: [
      { type: "pergunta", content: "¿Cuál fue la mejor parte de tu día de hoy?" },
      { type: "desafio", content: "¿Qué canción no te puedes sacar de la cabeza hoy? ¡Comparte el enlace!" },
      { type: "enquete", content: "¿Qué te gustaría ver en el stream de esta semana?\n1. Reacciones\n2. Gameplay relajante\n3. Charla\n4. Ver algo juntos" },
      { type: "meme", content: "El stream se cae de la nada. ¿Qué meme te representa en este momento?" }
    ]
  },
  "fr-FR": {
    variedades: [
      { type: "pergunta", content: "Quelle a été la meilleure partie de votre journée aujourd'hui ?" },
      { type: "desafio", content: "Quelle chanson avez-vous en tête aujourd'hui ? Partagez le lien !" },
      { type: "enquete", content: "Que voulez-vous voir sur le stream cette semaine ?\n1. Réactions\n2. Gameplay relaxant\n3. Discussion\n4. Regarder ensemble" },
      { type: "meme", content: "Le stream se coupe soudainement. Quel meme vous représente en ce moment ?" }
    ]
  },
  "ja-JP": {
    variedades: [
      { type: "pergunta", content: "今日の最高の一日は何でしたか？" },
      { type: "desafio", content: "今日頭から離れない曲は何ですか？リンクを共有してください！" },
      { type: "enquete", content: "今週の配信で何を見たいですか？\n1. リアクション\n2. リラックスしたゲームプレイ\n3. 雑談\n4. 同時視聴" },
      { type: "meme", content: "配信が突然オフラインになりました。今のあなたを表すミームは何ですか？" }
    ]
  }
};

export function getRandomTemplate(language: string, niche: string, type?: string) {
  const langTemplates = autoPostTemplates[language as keyof typeof autoPostTemplates] || autoPostTemplates['pt-BR'];
  
  // Define fallback niche key depending on available niches in that language
  let nicheKey = niche;
  if (!(niche in langTemplates)) {
    nicheKey = 'variety' in langTemplates ? 'variety' : 'variedades';
  }
  
  const nicheTemplates = langTemplates[nicheKey as keyof typeof langTemplates];
  
  let available = nicheTemplates;
  if (type) {
    available = nicheTemplates.filter(t => t.type === type);
    if (available.length === 0) available = nicheTemplates; // fallback if type not found
  }

  const random = available[Math.floor(Math.random() * available.length)];
  return random.content;
}
