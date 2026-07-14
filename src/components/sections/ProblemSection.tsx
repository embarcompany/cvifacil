import React from "react";
import { CalendarRange, ClipboardCheck, Edit, ShieldCheck } from "lucide-react";

export function ProblemSection() {
  const cards = [
    {
      icon: <CalendarRange className="w-6.5 h-6.5 text-primary" />,
      title: "Planejamento personalizado",
      text: "Analisamos seu destino, prazos e exigências específicas.",
    },
    {
      icon: <ClipboardCheck className="w-6.5 h-6.5 text-primary" />,
      title: "Coleta e revisão de documentos",
      text: "Conferimos cada detalhe para evitar erros e atrasos.",
    },
    {
      icon: <Edit className="w-6.5 h-6.5 text-primary" />,
      title: "Preenchimento correto",
      text: "Tudo preenchido de forma certa, com linguagem técnica adequada.",
    },
    {
      icon: <ShieldCheck className="w-6.5 h-6.5 text-primary" />,
      title: "Acompanhamento até a emissão",
      text: "Acompanhamos cada etapa até o CVI ser emitido.",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-20 border-b border-border/50">
      <div className="container-custom mx-auto flex flex-col gap-10">
        
        {/* Top Text (Centered/Full-width alignment matching mockup) */}
        <div className="w-full text-center lg:text-left max-w-2xl">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] mb-4 tracking-tight">
            O CVI não começa só no formulário.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-text-main leading-[1.6]">
            Existem etapas essenciais antes de preencher qualquer documento. A gente cuida de tudo para você.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col h-full shadow-[0_4px_20px_rgba(6,42,87,0.01)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(6,42,87,0.05)] hover:border-primary/20 group cursor-default"
            >
              {/* Icon Container */}
              <div className="mb-5 bg-blue-soft/50 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {card.icon}
              </div>
              
              {/* Card Title */}
              <h3 className="text-[16px] font-extrabold text-navy mb-2 transition-colors duration-300 group-hover:text-primary leading-snug">
                {card.title}
              </h3>
              
              {/* Card Text */}
              <p className="text-[13px] sm:text-[13.5px] text-text-muted leading-[1.5]">
                {card.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
