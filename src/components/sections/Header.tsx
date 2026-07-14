"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(6,42,87,0.05)] border-gray-100" 
          : "bg-white border-transparent"
      }`}
    >
      <div className="container-custom mx-auto h-[76px] flex items-center justify-between">
        {/* Logo */}
        <div className="w-[130px] md:w-[145px] h-[36px] flex items-center">
          <img
            src="/assets/logo-cvi-facil.png"
            alt="CVI Fácil"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right Area */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Text */}
          <div className="hidden lg:flex items-center gap-2 text-[13px] font-bold text-navy">
            <ShieldCheck className="w-4 h-4 text-whatsapp" />
            <span>Mais de 1.000 pets viajando com segurança</span>
          </div>

          {/* CTA Button */}
          <Button
            href="#avaliacao"
            variant="whatsapp"
            size="sm"
            showWhatsappIcon
            className="hidden md:flex h-10 text-[13px] rounded-lg"
          >
            Falar no WhatsApp
          </Button>

          {/* Mobile CTA */}
          <Button
            href="#avaliacao"
            variant="whatsapp"
            size="sm"
            className="md:hidden !px-4 h-9 text-[12px] rounded-lg"
          >
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </header>
  );
}
