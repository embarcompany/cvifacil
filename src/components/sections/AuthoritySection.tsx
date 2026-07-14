import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function AuthoritySection() {
  const differentials = [
    "Profissionais com experiência em documentação pet",
    "Atendimento próximo e humanizado via WhatsApp",
    "Foco total na segurança do seu pet",
  ];

  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden border-t border-gray-100">
      <div className="container-custom mx-auto flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
        
        {/* Left Column (Content & Differentials) */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Pill */}
          <span className="inline-block bg-blue-soft text-primary-dark font-extrabold text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-border/55">
            SUPORTE ESPECIALIZADO
          </span>

          {/* Title & Text */}
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[850] leading-[1.1] text-navy mb-6 tracking-tight max-w-[480px]">
            Especialistas em CVI para cães e gatos
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] text-text-main leading-[1.6] mb-8 max-w-[500px]">
            Nossa equipe cuida de todo o processo com experiência e atenção aos mínimos detalhes para que tudo saia perfeito.
          </p>

          {/* Differentials Checklist */}
          <div className="flex flex-col gap-4 text-left w-full max-w-[460px]">
            {differentials.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-150 transition-all duration-300 hover:bg-blue-soft/20 shadow-[0_2px_8px_rgba(6,42,87,0.01)]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#009639] flex-shrink-0" />
                <span className="text-[14px] sm:text-[14.5px] font-bold text-navy leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column (Image) */}
        <div className="w-full lg:w-[45%] relative mt-6 lg:mt-0 flex justify-center">
          <div className="relative w-full max-w-[520px] aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(6,42,87,0.06)] border border-gray-100">
            <Image 
              src="/assets/especialista-com-pet.png" 
              alt="Especialista em CVI com cão" 
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
