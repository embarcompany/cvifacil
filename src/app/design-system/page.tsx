import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Design System",
  robots: {
    index: false,
    follow: false,
  },
};

const colors = [
  ["Primary", "#1182BA"],
  ["Navy", "#062A57"],
  ["WhatsApp", "#05B85C"],
  ["Text", "#12213C"],
  ["Muted", "#4E5E72"],
  ["Blue soft", "#EEF8FC"],
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-white text-text-main">
      <section className="container-custom mx-auto max-w-5xl py-12 md:py-20">
        <Link href="/" className="text-[13px] font-extrabold text-primary hover:text-primary-dark">
          Voltar para o site
        </Link>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-border bg-blue-soft px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary-dark">
            CVI Fácil
          </span>
          <h1 className="mt-5 text-[32px] font-black leading-tight text-navy md:text-[46px]">
            Design System
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            Referência rápida de cores, botões, cards e padrões visuais usados no site.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          <section>
            <h2 className="mb-4 text-[20px] font-black text-navy">Cores</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {colors.map(([name, value]) => (
                <div key={name} className="rounded-2xl border border-border p-4">
                  <div className="h-14 rounded-xl" style={{ backgroundColor: value }} />
                  <div className="mt-3 flex items-center justify-between">
                    <strong className="text-[14px] text-navy">{name}</strong>
                    <span className="text-[12px] font-bold text-text-muted">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[20px] font-black text-navy">Botões</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 text-[15px] font-black uppercase tracking-wide text-white">
                Iniciar meu CVI <ArrowRight className="h-5 w-5" />
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-7 text-[15px] font-black text-text-muted">
                Voltar
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[20px] font-black text-navy">Cards</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["Seguro", "Guiado", "Especializado"].map((item) => (
                <div key={item} className="micro-card rounded-2xl border border-border bg-white p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-soft text-primary">
                    {item === "Seguro" ? <ShieldCheck className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <h3 className="text-[17px] font-black text-navy">{item}</h3>
                  <p className="mt-2 text-[13.5px] font-semibold leading-relaxed text-text-muted">
                    Card com borda leve, raio de 16 a 24px e microinteração no hover.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
