"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Quanto tempo leva para emitir o CVI?",
    answer: "O prazo depende do país de destino. Para a União Europeia, por exemplo, o processo leva no mínimo 3 a 4 meses devido à sorologia de raiva. Para países das Américas (como EUA ou Mercosul), o trâmite é muito mais rápido, levando poucas semanas."
  },
  {
    question: "Quais países exigem o CVI?",
    answer: "Quase todos os países fora do Mercosul exigem o CVI (Certificado Veterinário Internacional) para permitir a entrada de cães e gatos. Ele é o documento oficial de trânsito internacional de animais emitido pelas autoridades brasileiras."
  },
  {
    question: "Meu pet precisa tomar vacinas específicas?",
    answer: "A vacina contra raiva é obrigatória para todos os destinos internacionais e deve estar em dia. Outros destinos exigem vacinas adicionais (como a V10/V8 para cães ou a quádrupla para gatos), além de tratamentos contra vermes e parasitas em prazos rígidos."
  },
  {
    question: "Preciso ir ao MAPA pessoalmente?",
    answer: "Não! O processo de emissão do CVI hoje é realizado de forma digital. Nós cuidamos de toda a intermediação e submissão dos documentos eletronicamente junto ao MAPA (Vigiagro), sem que você precise se deslocar."
  },
  {
    question: "E se eu já tiver parte da documentação?",
    answer: "Sem problemas! Analisamos o que você já providenciou (como vacinas, microchip ou sorologia) e organizamos apenas as etapas que faltam, garantindo que tudo atenda às exigências sem custos duplicados."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Split FAQs: Column 1 has 3 items, Column 2 has 2 items
  const col1 = faqs.slice(0, 3);
  const col2 = faqs.slice(3, 5);

  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="container-custom mx-auto">
        
        {/* Title */}
        <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] text-navy mb-12 tracking-tight">
          Perguntas frequentes
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          
          {/* Left Area (Accordions in 2 Columns) */}
          <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            
            {/* Column 1 (Items 0, 1, 2) */}
            <div className="flex flex-col gap-4">
              {col1.map((faq, idx) => {
                const originalIndex = idx;
                const isOpen = openIndex === originalIndex;
                return (
                  <div 
                    key={originalIndex} 
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen 
                        ? "bg-white border-primary/20 shadow-[0_8px_30px_rgba(6,42,87,0.04)]" 
                        : "bg-white border-gray-100 hover:border-gray-200/80 shadow-[0_2px_8px_rgba(6,42,87,0.01)]"
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                      onClick={() => toggleAccordion(originalIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${originalIndex}`}
                    >
                      <span className="font-extrabold text-[15px] sm:text-[16px] text-navy pr-4 leading-snug">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10' : 'rotate-0'}`}>
                        <ChevronDown className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                    
                    <div 
                      id={`faq-answer-${originalIndex}`}
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[300px] opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
                      }`}
                    >
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-[14px] text-text-main leading-[1.6]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2 (Items 3, 4) */}
            <div className="flex flex-col gap-4">
              {col2.map((faq, idx) => {
                const originalIndex = idx + 3;
                const isOpen = openIndex === originalIndex;
                return (
                  <div 
                    key={originalIndex} 
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen 
                        ? "bg-white border-primary/20 shadow-[0_8px_30px_rgba(6,42,87,0.04)]" 
                        : "bg-white border-gray-100 hover:border-gray-200/80 shadow-[0_2px_8px_rgba(6,42,87,0.01)]"
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                      onClick={() => toggleAccordion(originalIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${originalIndex}`}
                    >
                      <span className="font-extrabold text-[15px] sm:text-[16px] text-navy pr-4 leading-snug">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10' : 'rotate-0'}`}>
                        <ChevronDown className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                    
                    <div 
                      id={`faq-answer-${originalIndex}`}
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[300px] opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
                      }`}
                    >
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-[14px] text-text-main leading-[1.6]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Area (Contact Card) */}
          <div className="w-full lg:w-[35%] flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="w-full max-w-[360px] bg-gradient-to-b from-white to-blue-soft/20 border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(6,42,87,0.04)] relative overflow-hidden flex flex-col min-h-[280px] group transition-all duration-300 hover:shadow-[0_20px_48px_rgba(6,42,87,0.08)]">
              
              <h3 className="text-[20px] font-extrabold text-navy mb-2 tracking-tight">
                Ainda tem dúvidas?
              </h3>
              <p className="text-[13.5px] text-text-muted leading-[1.5] mb-6 max-w-[220px]">
                Fale agora com nossa equipe pelo WhatsApp e receba orientações personalizadas.
              </p>
              
              <Button
                href="#avaliacao"
                variant="whatsapp"
                showWhatsappIcon
                className="w-full sm:w-auto self-start z-10 h-11 text-[13.5px] shadow-[0_4px_12px_rgba(8,168,107,0.2)]"
              >
                Falar no WhatsApp
              </Button>

              {/* Dog Image */}
              <div className="absolute -bottom-2 -right-4 w-[160px] h-[160px] opacity-90 z-0 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                <Image 
                  src="/assets/faq-cachorro.png" 
                  alt="FAQ Cachorro" 
                  fill
                  className="object-contain object-bottom-right"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
