import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

export function ConsequencesSection() {
  const risks = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Entrada negada",
      text: "Seu pet pode ser impedido de entrar no país e precisar retornar."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Quarentena forçada",
      text: "Gastos altos e estresse para o pet com procedimentos de quarentena."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Perda da data da viagem",
      text: "Passagens, hospedagens e conexões podem ser canceladas ou remarcadas."
    }
  ];

  return (
    <section className="bg-red-50/40 py-12 md:py-20 border-y border-red-100/60 relative overflow-hidden">
      <div className="container-custom mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-2 flex flex-col items-center">
          <span className="inline-flex items-center justify-center gap-1.5 bg-red-100/80 text-red-700 px-4.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider mb-4 border border-red-200/50">
            <AlertTriangle className="w-3.5 h-3.5" />
            O que acontece se a documentação do pet falhar?
          </span>
          <h2 className="text-[26px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] tracking-tight">
            Evite dores de cabeça e atrasos desnecessários
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {risks.map((risk, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-red-100/70 rounded-2xl p-6 lg:p-7 flex flex-col h-full shadow-[0_4px_16px_rgba(239,68,68,0.01)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(239,68,68,0.06)] hover:border-red-250 group"
            >
              <div className="mb-5 bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {risk.icon}
              </div>
              <h3 className="text-[17px] font-extrabold text-navy mb-2.5 transition-colors duration-300 group-hover:text-red-650">
                {risk.title}
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-text-muted leading-[1.5]">
                {risk.text}
              </p>
            </div>
          ))}
        </div>

        {/* Red CTA Button */}
        <div className="text-center px-4">
          <Button 
            href="#avaliacao" 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_16px_rgba(220,38,38,0.2)] border-none transition-all duration-300 hover:scale-102"
          >
            Evitar riscos e faça seu CVI do jeito certo
          </Button>
        </div>
      </div>
    </section>
  );
}
