import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-text-main">
      <section className="container-custom mx-auto max-w-3xl py-12 md:py-20">
        <Link href="/" className="text-[13px] font-extrabold text-primary hover:text-primary-dark">
          Voltar para o site
        </Link>

        <h1 className="mt-6 text-[32px] font-black leading-tight text-navy md:text-[42px]">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Esta política explica como a CVI Fácil coleta e utiliza dados enviados por tutores interessados em assessoria documental para viagens internacionais com pets.
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-[20px] font-black text-navy">Dados coletados</h2>
            <p className="mt-2">
              Podemos coletar nome, WhatsApp, e-mail, cidade de origem, país de destino, previsão da viagem e informações básicas sobre cães e gatos informadas no formulário.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Uso dos dados</h2>
            <p className="mt-2">
              Os dados são usados para responder solicitações, orientar o tutor, continuar o atendimento pelo WhatsApp e avaliar as necessidades iniciais da viagem.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Compartilhamento</h2>
            <p className="mt-2">
              Não vendemos dados pessoais. Informações podem ser usadas em ferramentas de atendimento, análise e operação necessárias para prestar o serviço solicitado.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Contato</h2>
            <p className="mt-2">
              Para dúvidas sobre privacidade, fale com a CVI Fácil pelo e-mail{" "}
              <a href="mailto:contato@cvifacil.com.br" className="font-bold text-primary hover:text-primary-dark">
                contato@cvifacil.com.br
              </a>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
