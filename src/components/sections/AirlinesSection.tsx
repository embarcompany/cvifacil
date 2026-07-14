import React from "react";

// Customized inline SVG components to represent the official airline logos
const LatamLogo = () => (
  <span className="flex items-center gap-2">
    <svg className="w-5 h-5 text-[#1b0088]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 21h20v-2H2v2zm2-4h16v-2H4v2zm2-4h12V11H6v2zm4-4h4V7h-4v2z" className="opacity-80" />
      <path d="M12 2L2 9h20L12 2z" />
    </svg>
    <span className="text-[#1b0088] font-[900] tracking-tight text-[14px]">LATAM</span>
  </span>
);

const TapLogo = () => (
  <span className="flex items-center gap-1.5">
    <span className="w-5 h-5 rounded-md bg-[#009639] flex items-center justify-center text-white text-[9px] font-extrabold">TAP</span>
    <span className="text-[#E30613] font-[950] tracking-tighter text-[13px] uppercase">Air Portugal</span>
  </span>
);

const KlmLogo = () => (
  <span className="flex items-center gap-1.5">
    <svg className="w-5 h-5 text-[#00A1DE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 4l3 5H9l3-5zm0 0v16M5 12h14" strokeLinecap="round" />
    </svg>
    <span className="text-[#00A1DE] font-[900] text-[15px] italic tracking-tight">KLM</span>
  </span>
);

const LufthansaLogo = () => (
  <span className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full bg-[#001D4A] flex items-center justify-center text-yellow-400 font-extrabold text-[9px]">L</div>
    <span className="text-[#001D4A] font-[850] text-[13px] uppercase tracking-wider">Lufthansa</span>
  </span>
);

const CopaLogo = () => (
  <span className="flex items-center gap-2">
    <svg className="w-5 h-5 text-[#0033A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6a9 9 0 0112.8 0M5.6 18.4a9 9 0 0012.8 0" />
    </svg>
    <span className="text-[#0033A0] font-[900] text-[14px] uppercase tracking-tighter">CopaAirlines</span>
  </span>
);

export function AirlinesSection() {
  const brandLogos = [
    <TapLogo key="tap" />,
    <LatamLogo key="latam" />,
    <KlmLogo key="klm" />,
    <LufthansaLogo key="lufthansa" />,
    <CopaLogo key="copa" />,
  ];

  // Repeat logos for seamless marquee infinite loop
  const duplicatedLogos = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-8 border-y border-gray-100 overflow-hidden">
      <div className="container-custom mx-auto">
        <p className="text-center text-[11px] md:text-[12px] font-extrabold text-text-muted uppercase tracking-[0.2em] mb-5">
          Tutores confiam, companhias aceitam
        </p>
        
        {/* Infinite Carousel Wrapper */}
        <div className="relative w-full overflow-hidden">
          {/* Mask gradient fade effect on borders for premium aesthetic */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee flex gap-6 md:gap-8 py-2 items-center">
            {duplicatedLogos.map((logo, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-center bg-white px-5 py-3 rounded-2xl shadow-[0_4px_16px_rgba(6,42,87,0.03)] border border-gray-100 transition-all duration-300 hover:scale-105 shrink-0 min-h-[44px]"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
