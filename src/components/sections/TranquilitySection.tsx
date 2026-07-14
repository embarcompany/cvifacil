import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function TranquilitySection() {
  const items = [
    "Atendimento rápido e próximo",
    "Orientações claras em linguagem simples",
    "Acompanhamento completo do seu caso",
    "Notificações e lembretes de prazos",
    "Segurança e tranquilidade até a emissão",
  ];

  return (
    <section className="bg-[#eef8fc] py-16 md:py-24 border-b border-gray-100">
      <div className="container-custom mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column (Phone Illustration) */}
        <div className="w-full lg:w-[45%] flex justify-center relative">
          {/* Subtle backdrop circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] bg-white rounded-full pointer-events-none -z-10 shadow-[0_8px_30px_rgba(6,42,87,0.02)]" />
          
          <div className="relative w-full max-w-[420px] aspect-[1/1.05] overflow-hidden rounded-[24px]">
            <Image 
              src="/assets/whatsapp-na-mao.png" 
              alt="Mão segurando celular com WhatsApp do CVI Fácil" 
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Column (Content) */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Eyebrow / Pill */}
          <div className="inline-flex items-center justify-center border border-[#1182ba]/30 text-[#1182ba] text-[11px] md:text-[12px] font-bold uppercase rounded-full px-4 py-1.5 mb-6 bg-white tracking-wider">
            SUPORTE VIA WHATSAPP
          </div>

          {/* Title & Text */}
          <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-[850] leading-[1.1] text-navy mb-5 tracking-tight">
            Menos dúvidas.<span className="block text-[#009639] lg:inline"> Mais tranquilidade.</span>
          </h2>
          
          <p className="text-[15px] sm:text-[16.5px] text-text-main leading-[1.6] mb-8 max-w-[500px]">
            Fale com nossa equipe especialista sempre que precisar e receba orientações claras em cada etapa.
          </p>

          {/* Checklist of Solutions */}
          <ul className="flex flex-col gap-4 text-left w-full max-w-[460px] mb-4">
            {items.map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 bg-white p-4.5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(6,42,87,0.01)] transition-all duration-300 hover:translate-x-1"
              >
                <CheckCircle2 className="w-5 h-5 text-[#009639] flex-shrink-0 mt-0.5" />
                <span className="text-[14px] sm:text-[14.5px] font-bold text-navy leading-tight">
                  {item}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}
