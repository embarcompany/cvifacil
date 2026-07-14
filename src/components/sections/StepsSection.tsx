import React from "react";
import { Plane, ClipboardCheck, Files, CheckCircle } from "lucide-react";

export function StepsSection() {
  const steps = [
    {
      icon: <Plane className="w-6 h-6 text-[#1182ba]" />,
      title: "1. Atendimento",
      text: "Entendemos o destino e as exigências do pet."
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-[#1182ba]" />,
      title: "2. Documentação",
      text: "Reunimos, revisamos e preparamos tudo."
    },
    {
      icon: <Files className="w-6 h-6 text-[#1182ba]" />,
      title: "3. Aprovação",
      text: "Acompanhamos o processo com o MAPA até a emissão."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#1182ba]" />,
      title: "4. Viagem segura",
      text: "Você recebe o CVI e viaja com total tranquilidade."
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-gray-100">
      <div className="container-custom mx-auto">
        
        {/* Title */}
        <h2 className="text-[30px] md:text-[38px] lg:text-[42px] font-[850] text-center text-navy mb-16 tracking-tight">
          Seu CVI organizado em <span className="text-[#009639]">4 etapas</span>
        </h2>

        {/* Steps Container */}
        <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-6 justify-between max-w-5xl mx-auto px-4 lg:px-0">
          
          {/* Connector Line (Desktop) - Centered vertically at 24px (middle of w-12 circle) */}
          <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-[#1182ba]/25 z-0" />

          {/* Connector Line (Mobile) - Centered horizontally at 24px (middle of w-12 circle) */}
          <div className="block lg:hidden absolute top-6 bottom-6 left-10 w-[2px] border-l-2 border-dashed border-[#1182ba]/25 z-0" />

          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-5 flex-grow flex-1 z-10"
            >
              {/* Step indicator node (Circle) - bg-white hides the dashed line behind it */}
              <div className="relative shrink-0 w-12 h-12 rounded-full border-2 border-[#1182ba] bg-white flex items-center justify-center shadow-sm z-15">
                {step.icon}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-navy text-white font-extrabold text-[10px] flex items-center justify-center">
                  {idx + 1}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 lg:text-center mt-1 lg:mt-0">
                <h3 className="text-[17px] font-extrabold text-navy mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[13.5px] sm:text-[14px] text-text-muted leading-[1.5] max-w-[240px] lg:mx-auto">
                  {step.text}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
