"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../ui/Button";

export function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<"cvi" | "diy">("cvi");

  const comparisonData = [
    {
      feature: "Entender as exigências do país",
      diy: "Demorado e confuso",
      cvi: "Análise personalizada"
    },
    {
      feature: "Contar documentos corretos",
      diy: "Risco de falta ou erro",
      cvi: "Checklist completo e revisado"
    },
    {
      feature: "Preencher formulários",
      diy: "Pode ser rejeitado",
      cvi: "Preenchimento técnico sem erros"
    },
    {
      feature: "Acompanhar prazos",
      diy: "Fácil perder prazos",
      cvi: "Controle e lembretes automáticos"
    },
    {
      feature: "Falar com o MAPA",
      diy: "Dificuldade e espera",
      cvi: "Intermediação e suporte"
    },
    {
      feature: "Tranquilidade na viagem",
      diy: "Preocupação constante",
      cvi: "Viagem segura e tranquila"
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-gray-100">
      <div className="container-custom mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-2">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] mb-5 tracking-tight">
            Por que escolher a CVI Fácil?
          </h2>
        </div>

        {/* Mobile Layout (Tabs & Cards) - Visible on mobile only */}
        <div className="block md:hidden px-2">
          {/* Tab buttons */}
          <div className="flex bg-blue-soft/60 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("cvi")}
              className={`flex-1 py-3 text-[14px] font-extrabold rounded-lg transition-all ${
                activeTab === "cvi"
                  ? "bg-primary text-white shadow-sm"
                  : "text-navy"
              }`}
            >
              Com a CVI Fácil
            </button>
            <button
              onClick={() => setActiveTab("diy")}
              className={`flex-1 py-3 text-[14px] font-extrabold rounded-lg transition-all ${
                activeTab === "diy"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-navy"
              }`}
            >
              Fazer sozinho
            </button>
          </div>

          {/* Active Card Content */}
          <div className={`p-6 rounded-2xl border transition-all ${
            activeTab === "cvi" 
              ? "bg-blue-soft/20 border-primary/20 shadow-md"
              : "bg-red-50/20 border-red-100/50 shadow-sm"
          }`}>
            <h3 className={`text-[17px] font-extrabold mb-4 flex items-center gap-2 ${
              activeTab === "cvi" ? "text-primary-dark" : "text-red-750"
            }`}>
              {activeTab === "cvi" ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-whatsapp" />
                  Com a CVI Fácil
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  Fazer sozinho
                </>
              )}
            </h3>

            <div className="space-y-4">
              {comparisonData.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <span className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    {item.feature}
                  </span>
                  <span className={`text-[14.5px] ${
                    activeTab === "cvi" ? "text-emerald-700 font-black" : "text-red-650 font-bold"
                  }`}>
                    {activeTab === "cvi" ? item.cvi : item.diy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout (Table Matrix) - Visible on md & above */}
        <div className="hidden md:block max-w-4xl mx-auto bg-white border border-border rounded-[24px] shadow-[0_12px_40px_rgba(6,42,87,0.03)] overflow-hidden">
          {/* Table Header */}
          <div className="flex bg-navy text-white">
            <div className="flex-[1.2] p-6 flex items-center text-[15px] md:text-[16px] font-extrabold tracking-wider uppercase opacity-90">
              O QUE VOCÊ PRECISA
            </div>
            
            {/* DIY Header */}
            <div className="flex-1 p-6 border-l border-white/10 bg-navy flex items-center justify-center text-center">
              <span className="text-[17px] font-bold flex items-center gap-1.5 justify-center">
                <XCircle className="w-5 h-5 text-red-400" /> Fazer sozinho
              </span>
            </div>

            {/* CVI Fácil Header */}
            <div className="flex-1 p-6 border-l border-white/10 bg-primary flex items-center justify-center text-center relative overflow-hidden">
              <span className="text-[17px] font-extrabold text-white flex items-center gap-1.5 justify-center relative z-10">
                <CheckCircle2 className="w-5 h-5 text-white" /> Com a CVI Fácil
              </span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col divide-y divide-border">
            {comparisonData.map((row, idx) => (
              <div key={idx} className="flex hover:bg-gray-50 transition-colors">
                <div className="flex-[1.2] p-5 flex items-center text-[14.5px] font-bold text-navy">
                  {row.feature}
                </div>
                {/* DIY Cell */}
                <div className="flex-1 p-5 border-l border-border bg-red-50/5 flex items-center justify-center gap-2 text-[14px] text-red-650 font-bold text-center">
                  <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                  <span>{row.diy}</span>
                </div>
                {/* CVI Fácil Cell */}
                <div className="flex-1 p-5 border-l border-border bg-emerald-50/5 flex items-center justify-center gap-2 text-[14.5px] font-extrabold text-emerald-700 text-center">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>{row.cvi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-12 text-center px-4">
          <Button href="#avaliacao" variant="whatsapp" showWhatsappIcon size="lg" className="w-full sm:w-[320px]">
            Quero começar meu CVI
          </Button>
        </div>

      </div>
    </section>
  );
}
