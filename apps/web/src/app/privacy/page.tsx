import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link href="/" className="text-purple-400 hover:underline mb-8 inline-block">← Voltar para a Home</Link>
        <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
        
        <div className="space-y-6 leading-relaxed">
          <p>
            A Astra Bot respeita a sua privacidade e os dados da sua comunidade. Coletamos apenas os dados essenciais para o funcionamento do bot, como:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IDs de servidores (Guild IDs)</li>
            <li>IDs de canais configurados</li>
            <li>IDs de usuários para o sistema de ranking</li>
            <li>Contagem de mensagens para a atividade da comunidade</li>
          </ul>
          <h2 className="text-2xl font-bold text-white mt-8">Uso dos Dados</h2>
          <p>
            Os dados coletados são usados estritamente para fornecer os serviços prometidos: ranking, relatórios e automações. 
            Nós não lemos nem armazenamos o conteúdo das mensagens dos membros para o ranking, apenas contabilizamos sua existência.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8">Exclusão de Dados</h2>
          <p>
            Você pode excluir permanentemente todos os dados do seu servidor a qualquer momento usando o comando `/dados apagar` no Discord ou através deste painel de controle.
          </p>
        </div>
      </div>
    </div>
  );
}
