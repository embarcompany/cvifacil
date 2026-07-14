import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "A CVI Fácil foi essencial para nossa viagem. Explicaram tudo e nos acompanharam em cada etapa.",
      name: "Juliana T. e Theo",
      route: "Porto Alegre - RS",
      imagePlaceholder: "depoimento-pet-01.png"
    },
    {
      quote: "Equipe incrível! Meu pet viajou para Portugal sem nenhum problema. Super recomendo!",
      name: "Rafael A. e Lilo",
      route: "São Paulo - SP",
      imagePlaceholder: "depoimento-pet-02.png"
    },
    {
      quote: "Atendimento rápido, claro e muito atencioso. Viagem tranquila e sem imprevistos.",
      name: "Camila M. e Mel",
      route: "Curitiba - PR",
      imagePlaceholder: "depoimento-pet-01.png"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50/50 py-16 md:py-24 border-t border-gray-100">
      <div className="container-custom mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[850] text-navy tracking-tight">
            Histórias reais de viagens tranquilas
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100/80 rounded-2xl p-6 lg:p-8 shadow-[0_4px_24px_rgba(6,42,87,0.02)] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_16px_40px_rgba(6,42,87,0.06)] hover:border-primary/10"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-star text-star" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-[14px] sm:text-[14.5px] text-text-main italic leading-[1.6] mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author / Pet Details */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-150 border-2 border-gray-200">
                  <Image 
                    src={`/assets/${t.imagePlaceholder}`} 
                    alt={t.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[14px] font-extrabold text-navy leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {t.route}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
