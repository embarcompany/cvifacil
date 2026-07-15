"use client";

import React, { useState } from "react";
import { Dog, Cat, Zap, ShieldCheck, HeartHandshake, ArrowRight, Lock } from "lucide-react";
import { Button } from "../ui/Button";

interface FormData {
  nomeTutor: string;
  emailOuTelefone: string;
  tipoPet: "Cão" | "Gato";
  paisDestino: string;
  dataViagem: string;
  idadePet: string;
}

interface FormErrors {
  nomeTutor?: string;
  emailOuTelefone?: string;
  paisDestino?: string;
  dataViagem?: string;
  idadePet?: string;
}

export function FormSection() {
  const [formData, setFormData] = useState<FormData>({
    nomeTutor: "",
    emailOuTelefone: "",
    tipoPet: "Cão",
    paisDestino: "",
    dataViagem: "",
    idadePet: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nomeTutor.trim()) newErrors.nomeTutor = "Por favor, digite seu nome";
    if (!formData.emailOuTelefone.trim()) newErrors.emailOuTelefone = "Por favor, digite seu e-mail ou telefone";
    if (!formData.paisDestino) newErrors.paisDestino = "Por favor, selecione o país de destino";
    if (!formData.dataViagem) newErrors.dataViagem = "Por favor, informe a data aproximada";
    if (!formData.idadePet) newErrors.idadePet = "Por favor, selecione a idade do pet";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Format WhatsApp message with parameters
    const whatsappNumber = "5511942452218";
    const text = `Olá! Gostaria de receber a análise gratuita do meu CVI.\n\n*Dados do Pet:*\n- Espécie: ${formData.tipoPet}\n- Idade: ${formData.idadePet}\n- Destino: ${formData.paisDestino}\n- Data da Viagem: ${formData.dataViagem}\n\n*Dados do Tutor:*\n- Nome: ${formData.nomeTutor}\n- Contato: ${formData.emailOuTelefone}`;
    const encodedText = encodeURIComponent(text);
    
    // Redirect after a short delay
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, "_blank");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section id="avaliacao" className="relative bg-blue-section overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-teal/30 blur-[100px] mix-blend-screen" />
      </div>

      <div className="container-custom mx-auto py-12 md:py-20 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
        
        {/* Left Column */}
        <div className="w-full lg:w-[40%] flex flex-col text-white text-center lg:text-left items-center lg:items-start px-2">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] leading-[1.15] mb-5 tracking-tight max-w-[480px]">
            Descubra o caminho do CVI para a sua viagem
          </h2>
          <p className="text-[14.5px] sm:text-[16px] text-blue-100/90 leading-[1.6] mb-8 max-w-[440px]">
            Preencha os dados ao lado e nosso time irá traçar o plano ideal para você.
          </p>

          {/* Core Trust Indicators */}
          <div className="flex flex-col gap-5 text-left max-w-[360px] w-full">
            {[
              {
                icon: <Zap className="w-5 h-5 text-white" />,
                title: "Rápido",
                desc: "Leva menos de 2 minutos."
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-white" />,
                title: "Seguro",
                desc: "Seus dados estão protegidos."
              },
              {
                icon: <HeartHandshake className="w-5 h-5 text-white" />,
                title: "Sem compromisso",
                desc: "Você recebe uma análise sem custo."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white/5 backdrop-blur-[2px] p-4.5 rounded-2xl border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <strong className="block text-[14px] font-bold text-white">{item.title}</strong>
                  <span className="text-[12.5px] text-blue-100/80">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Single Screen Form Card) */}
        <div className="w-full lg:w-[60%] flex justify-center lg:justify-end px-2 sm:px-0">
          <div className="w-full max-w-[600px] bg-white rounded-3xl shadow-[0_24px_50px_rgba(6,42,87,0.25)] border border-gray-150 overflow-hidden flex flex-col relative">
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
              
              {/* Row 1: Name and Contact */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Nome do tutor</label>
                  <input 
                    type="text"
                    placeholder="Digite seu nome"
                    className={`h-[50px] px-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50/90 focus:bg-white font-medium text-[14.5px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${errors.nomeTutor ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                    value={formData.nomeTutor}
                    onChange={(e) => setFormData({ ...formData, nomeTutor: e.target.value })}
                  />
                  {errors.nomeTutor && <span className="text-red-500 text-xs font-bold">{errors.nomeTutor}</span>}
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">E-mail ou telefone</label>
                  <input 
                    type="text"
                    placeholder="Digite seu contato"
                    className={`h-[50px] px-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50/90 focus:bg-white font-medium text-[14.5px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${errors.emailOuTelefone ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                    value={formData.emailOuTelefone}
                    onChange={(e) => setFormData({ ...formData, emailOuTelefone: e.target.value })}
                  />
                  {errors.emailOuTelefone && <span className="text-red-500 text-xs font-bold">{errors.emailOuTelefone}</span>}
                </div>
              </div>

              {/* Row 2: Pet Species Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Espécie do pet</label>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, tipoPet: "Cão" })}
                    className={`flex-grow flex-1 flex items-center justify-center gap-2.5 h-[50px] rounded-xl border-2 font-bold text-[14.5px] transition-all duration-300 group ${formData.tipoPet === 'Cão' ? 'border-primary bg-blue-soft/60 text-primary-dark shadow-sm' : 'border-gray-200 text-text-muted hover:border-gray-300 bg-white'}`}
                  >
                    <Dog className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" /> Cão
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, tipoPet: "Gato" })}
                    className={`flex-grow flex-1 flex items-center justify-center gap-2.5 h-[50px] rounded-xl border-2 font-bold text-[14.5px] transition-all duration-300 group ${formData.tipoPet === 'Gato' ? 'border-primary bg-blue-soft/60 text-primary-dark shadow-sm' : 'border-gray-200 text-text-muted hover:border-gray-300 bg-white'}`}
                  >
                    <Cat className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" /> Gato
                  </button>
                </div>
              </div>

              {/* Row 3: Destination Country */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">País de destino</label>
                <select 
                  className={`h-[50px] px-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50/90 focus:bg-white font-medium text-[14.5px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${errors.paisDestino ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                  value={formData.paisDestino}
                  onChange={(e) => setFormData({ ...formData, paisDestino: e.target.value })}
                >
                  <option value="">Selecione o país</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Portugal">Portugal</option>
                  <option value="União Europeia">União Europeia (Outros)</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.paisDestino && <span className="text-red-500 text-xs font-bold">{errors.paisDestino}</span>}
              </div>

              {/* Row 4: Travel Date and Pet Age */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Data prevista da viagem</label>
                  <input 
                    type="date"
                    className={`h-[50px] px-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50/90 focus:bg-white font-medium text-[14.5px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${errors.dataViagem ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                    value={formData.dataViagem}
                    onChange={(e) => setFormData({ ...formData, dataViagem: e.target.value })}
                  />
                  {errors.dataViagem && <span className="text-red-500 text-xs font-bold">{errors.dataViagem}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Idade do pet</label>
                  <select 
                    className={`h-[50px] px-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50/90 focus:bg-white font-medium text-[14.5px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${errors.idadePet ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                    value={formData.idadePet}
                    onChange={(e) => setFormData({ ...formData, idadePet: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="Filhote (Menos de 1 ano)">Filhote (Menos de 1 ano)</option>
                    <option value="Adulto (1 a 7 anos)">Adulto (1 a 7 anos)</option>
                    <option value="Sênior (Mais de 7 anos)">Sênior (Mais de 7 anos)</option>
                  </select>
                  {errors.idadePet && <span className="text-red-500 text-xs font-bold">{errors.idadePet}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="whatsapp"
                showWhatsappIcon
                className="mt-3 w-full h-[52px] font-extrabold text-[15px] uppercase tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Quero meu plano gratuito"}
              </Button>

              <p className="text-center text-[12px] text-text-muted font-medium">
                Resposta rápida via WhatsApp em horário comercial.
              </p>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
