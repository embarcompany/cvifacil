import React from "react";
import { Button } from "../ui/Button";

export function CtaSection() {
  return (
    <section className="bg-blue-section py-16 md:py-20 relative overflow-hidden">
      
      {/* Decorative gradients / Mesh elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="container-custom mx-auto relative z-10 text-center px-4 flex flex-col items-center">
        
        {/* Title */}
        <h2 className="text-[30px] sm:text-[38px] md:text-[44px] font-[850] text-white leading-tight mb-5 tracking-tight max-w-[700px]">
          A viagem do seu pet começa no destino certo
        </h2>

        {/* Subheading */}
        <p className="text-[16px] sm:text-[18px] text-blue-105/90 leading-[1.6] mb-8 max-w-[580px]">
          Conte com quem entende de CVI para levar seu melhor amigo ainda mais longe.
        </p>

        {/* Button */}
        <Button 
          href="#avaliacao" 
          variant="whatsapp" 
          showWhatsappIcon
          size="lg" 
          className="w-full sm:w-[320px] shadow-[0_8px_24px_rgba(8,168,107,0.15)] uppercase font-extrabold tracking-wide"
        >
          Quero começar meu CVI
        </Button>

      </div>
    </section>
  );
}
