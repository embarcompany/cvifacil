import React from "react";
import { MessageSquare, ClipboardList, Headset, Award } from "lucide-react";

export function TrustStrip() {
  const items = [
    {
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      title: "Atendimento",
      subtitle: "humanizado",
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-white" />,
      title: "Processo guiado",
      subtitle: "do início ao fim",
    },
    {
      icon: <Headset className="w-5 h-5 text-white" />,
      title: "Suporte rápido",
      subtitle: "pelo WhatsApp",
    },
    {
      icon: <Award className="w-5 h-5 text-white" />,
      title: "Especialistas ema",
      subtitle: "documentação",
    },
  ];

  return (
    <section className="bg-navy py-6 border-b border-white/5">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-4 sm:px-0 justify-center sm:justify-start">
              <div className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-white text-[13px] md:text-[14px] font-[800] leading-tight uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-blue-200/80 text-[12px] md:text-[13px] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
