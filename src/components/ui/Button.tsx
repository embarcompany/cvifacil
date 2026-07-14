import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "whatsapp" | "outline";
  size?: "default" | "lg" | "sm";
  icon?: React.ReactNode;
  showWhatsappIcon?: boolean;
  pulse?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "default",
  className = "",
  icon,
  showWhatsappIcon,
  pulse = false,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-[800] rounded-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-50 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-[0_8px_20px_rgba(17,130,186,0.25)] hover:shadow-[0_12px_28px_rgba(17,130,186,0.35)] focus-visible:ring-primary",
    whatsapp: "bg-whatsapp hover:bg-whatsapp-hover text-white shadow-[0_8px_20px_rgba(8,168,107,0.25)] hover:shadow-[0_12px_28px_rgba(8,168,107,0.35)] focus-visible:ring-whatsapp",
    outline: "border-2 border-primary text-primary hover:bg-blue-soft shadow-sm hover:shadow-md focus-visible:ring-primary",
  };

  const sizes = {
    default: "h-12 px-6 text-[15px]",
    lg: "h-14 px-8 text-[17px] sm:text-[18px]",
    sm: "h-10 px-4 text-[14px]",
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${pulse ? 'animate-pulse-glow' : ''} ${className}`;

  const shineEffect = (
    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
  );

  if (href) {
    return (
      <a href={href} className={finalClass} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {showWhatsappIcon && <WhatsAppIcon className="w-5 h-5 mr-2" size={20} />}
        {icon && <span className="mr-2">{icon}</span>}
        <span className="relative z-10">{children}</span>
        {variant !== "outline" && shineEffect}
      </a>
    );
  }

  return (
    <button className={finalClass} {...props}>
      {showWhatsappIcon && <WhatsAppIcon className="w-5 h-5 mr-2" size={20} />}
      {icon && <span className="mr-2">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {variant !== "outline" && shineEffect}
    </button>
  );
}
