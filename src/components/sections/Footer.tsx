import React from "react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Variables mapped from prompt placeholders
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "(11) 99999-9999";
  const email = process.env.NEXT_PUBLIC_EMAIL || "contato@cvifacil.com.br";
  const cidade = process.env.NEXT_PUBLIC_CIDADE || "São Paulo";
  const uf = process.env.NEXT_PUBLIC_UF || "SP";
  const horario = process.env.NEXT_PUBLIC_HORARIO || "Seg a Sex, 09h às 18h";

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-border">
      <div className="container-custom mx-auto">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Col 1: Marca */}
          <div className="flex flex-col">
            <div className="w-[140px] h-[40px] mb-6 flex items-center">
              <img
                src="/assets/logo-cvi-facil.png"
                alt="CVI Fácil"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-[14px] text-text-main leading-[1.6] mb-6">
              Orientação e acompanhamento para organizar o CVI do seu pet sem complicação.
            </p>
            <p className="text-[13px] text-text-muted mt-auto">
              &copy; {currentYear} CVI Fácil. Todos os direitos reservados.
            </p>
          </div>

          {/* Col 2: Atendimento */}
          <div className="flex flex-col">
            <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
              Atendimento
            </h4>
            <ul className="flex flex-col gap-3 text-[14px] text-text-main">
              <li><strong>WhatsApp:</strong> {whatsapp}</li>
              <li><strong>E-mail:</strong> {email}</li>
              <li><strong>Localização:</strong> {cidade} - {uf}</li>
              <li><strong>Horário:</strong> {horario}</li>
            </ul>
          </div>

          {/* Col 3: Institucional */}
          <div className="flex flex-col">
            <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
              Institucional
            </h4>
            <ul className="flex flex-col gap-3 text-[14px] text-text-main">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Quem somos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Aviso Legal */}
          <div className="flex flex-col">
            <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
              Aviso Legal
            </h4>
            <p className="text-[13px] text-text-muted leading-[1.6]">
              A CVI Fácil é uma empresa privada de orientação e acompanhamento documental e não representa o Ministério da Agricultura e Pecuária. A emissão oficial do CVI é realizada pela autoridade competente.
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-border pt-8 flex items-center justify-center text-center">
          <p className="text-[13px] text-text-muted">
            Desenvolvido com cuidado para tutores e seus pets.
          </p>
        </div>

      </div>
    </footer>
  );
}
