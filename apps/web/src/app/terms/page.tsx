import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link href="/" className="text-purple-400 hover:underline mb-8 inline-block">← Voltar para a Home</Link>
        <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>
        
        <div className="space-y-6 leading-relaxed">
          <p>
            Ao convidar a Astra Bot para o seu servidor, você concorda com os seguintes termos:
          </p>
          <h2 className="text-2xl font-bold text-white mt-8">1. Uso Aceitável</h2>
          <p>
            A Astra deve ser usada para fomentar engajamento positivo. Não a utilize em servidores que violem os Termos de Serviço do Discord.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8">2. Disponibilidade</h2>
          <p>
            Trabalhamos para manter o bot online 24/7, mas não nos responsabilizamos por perdas causadas por tempo de inatividade ou falhas no sistema.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8">3. Planos e Pagamentos</h2>
          <p>
            Os planos Premium (Pro e Creator) garantem recursos extras descritos em nossa página principal. Valores e recursos podem sofrer alterações com aviso prévio.
          </p>
        </div>
      </div>
    </div>
  );
}
