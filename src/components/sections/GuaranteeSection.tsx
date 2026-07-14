import React from "react";
import { ShieldCheck } from "lucide-react";

export function GuaranteeSection() {
  return (
    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
      <div className="container-custom mx-auto">
        <div className="max-w-4xl mx-auto bg-blue-soft/30 border border-gray-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left shadow-sm">
          
          {/* Solid Shield Icon Plate */}
          <div className="shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center border border-gray-200 shadow-[0_4px_12px_rgba(6,42,87,0.02)]">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>

          <div className="flex-1">
            <span className="inline-block bg-primary/10 text-primary-dark font-extrabold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-3">
              GARANTIA CVIFÁCIL
            </span>
            <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-extrabold text-navy leading-tight mb-3 tracking-tight">
              Garantia de Paz Mental
            </h2>
            <p className="text-[14.5px] sm:text-[15.5px] text-text-main leading-[1.6] mb-3 font-bold">
              Seu processo será conduzido por especialistas até a emissão do CVI com segurança, responsabilidade e total suporte.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
