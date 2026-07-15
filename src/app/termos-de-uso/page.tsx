import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-text-main">
      <section className="container-custom mx-auto max-w-3xl py-12 md:py-20">
        <Link href="/" className="text-[13px] font-extrabold text-primary hover:text-primary-dark">
          Voltar para o site
        </Link>

        <h1 className="mt-6 text-[32px] font-black leading-tight text-navy md:text-[42px]">
          Termos de Uso
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Ao utilizar o site da CVI Fácil, você concorda com as condições abaixo.
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-[20px] font-black text-navy">Natureza do serviço</h2>
            <p className="mt-2">
              A CVI Fácil é uma empresa privada de orientação e acompanhamento documental. Não representa órgãos oficiais, ministérios ou o Governo Federal.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Emissão do CVI</h2>
            <p className="mt-2">
              A emissão final do Certificado Veterinário Internacional é responsabilidade das autoridades sanitárias competentes. A assessoria não substitui decisões oficiais.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Informações do tutor</h2>
            <p className="mt-2">
              O tutor é responsável por fornecer informações corretas sobre viagem, pet, documentos, vacinas e prazos. Dados incorretos podem afetar a orientação e o andamento do processo.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-black text-navy">Contato</h2>
            <p className="mt-2">
              Dúvidas podem ser enviadas para{" "}
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
