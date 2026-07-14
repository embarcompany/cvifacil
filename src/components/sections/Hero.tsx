import React from "react";
import Image from "next/image";
import { CheckCircle2, Lock, Plane } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative bg-white pt-28 pb-12 md:pt-40 md:pb-20 overflow-hidden bg-grid-pattern">
      
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#eef8fc] blur-[80px] pointer-events-none -z-10" />

      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Left Column (Content) */}
        <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center justify-center border border-[#1182ba]/30 text-[#1182ba] text-[11px] md:text-[12px] font-bold uppercase rounded-full px-4 py-1.5 mb-6 bg-[#eef8fc] tracking-wider">
            CVI para cães e gatos em viagens internacionais
          </div>

          {/* H1 */}
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] xl:text-[58px] font-[850] leading-[1.1] text-navy mb-6 tracking-tight max-w-[620px]">
            Seu pet vai viajar para o exterior?
            <span className="text-[#009639] block mt-1"> Comece o CVI sem complicação.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-[16px] md:text-[18px] text-text-main leading-[1.6] mb-8 max-w-[540px]">
            Nós cuidamos de todo o processo de documentação com segurança, clareza e suporte humano via WhatsApp.
          </p>

          {/* Benefits */}
          <ul className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8 w-full">
            {[
              "Processo simples e guiado",
              "Especialistas em CVIs para cães e gatos",
              "Suporte humanizado via WhatsApp"
            ].map((text, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[13.5px] font-bold text-navy">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#009639] flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* CTA & Microcopy */}
          <div className="w-full sm:w-auto flex flex-col items-center lg:items-start gap-4">
            <Button
              href="#avaliacao"
              variant="whatsapp"
              size="lg"
              showWhatsappIcon
              className="w-full sm:w-[340px]"
            >
              Quero começar meu CVI
            </Button>
            
            {/* Social Proof Rating Widget */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-100 shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48&q=80" alt="Tutor 1" className="object-cover w-full h-full" />
                </div>
                <div className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-100 shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&h=48&q=80" alt="Tutor 2" className="object-cover w-full h-full" />
                </div>
                <div className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-100 shrink-0">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=48&h=48&q=80" alt="Tutor 3" className="object-cover w-full h-full" />
                </div>
              </div>
              <span className="text-[13px] font-bold text-navy">
                +1.000 tutores já viajaram tranquilo com a gente
              </span>
            </div>

            <div className="flex items-start justify-center lg:justify-start gap-2 text-[12px] text-text-muted max-w-[340px] text-center lg:text-left px-2 sm:px-0">
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Leva menos de 2 minutos. Tenha em mãos o destino e a data aproximada da viagem.</p>
            </div>
          </div>
        </div>

        {/* Right Column (Visual) */}
        <div className="w-full lg:w-[48%] relative flex justify-center mt-6 lg:mt-0">
          
          {/* Dashed background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full border-2 border-dashed border-[#1182ba]/20 pointer-events-none -z-10 animate-[spin_120s_linear_infinite]" />
          
          {/* Dashed Flight path with plane icon */}
          <div className="absolute top-[10%] right-[10%] w-[120px] h-[100px] pointer-events-none hidden md:block">
            <svg className="w-full h-full text-[#1182ba]/30" viewBox="0 0 100 100" fill="none">
              <path d="M10 80 Q 50 10 90 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <Plane className="absolute top-[10%] right-[5%] w-5 h-5 text-[#1182ba] rotate-45" />
          </div>

          <div className="relative w-full max-w-[540px] aspect-[1/1.05] overflow-hidden rounded-[24px]">
            <Image 
              src="/assets/hero-pets-viagem.png" 
              alt="Cães e gatos com mala de viagem" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
