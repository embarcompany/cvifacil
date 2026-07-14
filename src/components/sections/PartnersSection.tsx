import React from "react";

export function PartnersSection() {
  return (
    <section className="bg-white py-8 border-b border-gray-100 overflow-hidden">
      <div className="container-custom mx-auto text-center">
        <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.25em] mb-6">
          CONFIANÇA QUE ACOMPANHA VOCÊ E SEU PET
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-50 grayscale hover:opacity-85 transition-all duration-300">
          
          {/* Governo Federal / Brasil Logo */}
          <div className="flex items-center gap-2 select-none">
            <svg className="w-8 h-6 text-gray-800" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="24" rx="2" fill="#009639"/>
              <path d="M18 2L33 12L18 22L3 12L18 2z" fill="#FFCC00"/>
              <circle cx="18" cy="12" r="6" fill="#002277"/>
              <path d="M12 12.5 C 14 11, 20 11, 24 12.5" stroke="#FFFFFF" strokeWidth="1" fill="none"/>
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[13px] font-[900] text-gray-850 tracking-tighter">BRASIL</span>
              <span className="text-[7.5px] text-gray-500 font-bold uppercase tracking-tight">Governo Federal</span>
            </div>
          </div>

          {/* MAPA (Ministério da Agricultura) */}
          <div className="flex items-center gap-2 select-none">
            <svg className="w-8 h-8 text-gray-800" viewBox="0 0 32 32" fill="currentColor">
              {/* Stylized official green circle and leaf/globe details for MAPA */}
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M16 2v28M2 16h28" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 10c6-3,14-3,20 0M6 22c6 3,14 3,20 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[14px] font-[950] text-gray-850 tracking-wide uppercase">MAPA</span>
              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tighter">Min. da Agricultura</span>
            </div>
          </div>

          {/* ANVISA */}
          <div className="flex items-center gap-2 select-none">
            <svg className="w-8 h-8 text-gray-800" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5">
              {/* ANVISA stylized circular star-globe crest */}
              <circle cx="16" cy="16" r="13" />
              <path d="M16 6l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3-5.5 3 1.5-6-4.5-4 6-.5z" fill="currentColor" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[13px] font-[900] text-gray-850 tracking-wide">ANVISA</span>
              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tighter">Agência Sanitária</span>
            </div>
          </div>

          {/* IATA */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-7 rounded-md bg-gray-800 flex items-center justify-center text-white px-1">
              <span className="text-[13px] font-[950] tracking-tighter italic">IATA</span>
            </div>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[11px] font-extrabold text-gray-850 tracking-tight">MEMBER</span>
              <span className="text-[7px] text-gray-400 font-semibold uppercase tracking-wider">International Transit</span>
            </div>
          </div>

          {/* VIGIAGRO */}
          <div className="flex items-center gap-2 select-none border-l border-gray-200 pl-6">
            <svg className="w-7 h-8 text-gray-800" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Stylized shield and key/check for VIGIAGRO */}
              <path d="M12 2C12 2 3 5 3 12C3 19 12 26 12 26C12 26 21 19 21 12C21 5 12 2 12 2z" />
              <path d="M8 12l3 3 5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[12px] font-[950] text-gray-850 tracking-tight">VIGIAGRO</span>
              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tighter">Vigilância Agropecuária</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
