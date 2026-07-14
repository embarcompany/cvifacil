"use client";

import React, { useState, useEffect } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 500px
      setVisible(window.scrollY > 500);
    };

    const handleResize = () => {
      // Simple heuristic for mobile keyboard: if height drops significantly
      if (window.innerHeight < 500) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!visible || isKeyboardOpen) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <a
        href="#avaliacao"
        className="flex items-center justify-center w-full h-12 bg-whatsapp text-white font-bold rounded-lg shadow-md hover:bg-whatsapp-hover transition-colors"
      >
        <WhatsAppIcon className="w-5 h-5 mr-2" size={20} />
        Iniciar meu CVI no WhatsApp
      </a>
    </div>
  );
}
