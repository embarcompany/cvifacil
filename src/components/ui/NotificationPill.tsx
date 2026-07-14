"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface NotificationEvent {
  message: string;
  time: string;
}

const events: NotificationEvent[] = [
  { message: "Theo (Beagle) obteve o CVI para Portugal! 🇵🇹", time: "Há 2 min" },
  { message: "Luna (Gato) iniciou a análise para os EUA! 🇺🇸", time: "Há 5 min" },
  { message: "Mel (Poodle) está com CVI emitido para o Canadá! 🇨🇦", time: "Há 12 min" },
  { message: "Thor (Golden) vai viajar para a Espanha! 🇪🇸", time: "Há 20 min" },
  { message: "Nina (Gata) validou a sorologia para a Itália! 🇮🇹", time: "Há 30 min" },
  { message: "Amora (Bulldog) iniciou a assessoria para a Alemanha! 🇩🇪", time: "Há 45 min" },
];

export function NotificationPill() {
  const [currentEvent, setCurrentEvent] = useState<NotificationEvent | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Wait 5 seconds before showing the first notification
    const initialTimeout = setTimeout(() => {
      setCurrentEvent(events[0]);
    }, 5000);

    const interval = setInterval(() => {
      setCurrentEvent(null); // hide

      setTimeout(() => {
        setIndex((prev) => {
          const nextIndex = (prev + 1) % events.length;
          setCurrentEvent(events[nextIndex]);
          return nextIndex;
        });
      }, 1000); // Wait 1 second before showing the next one
    }, 12000); // Cycle every 12 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 pointer-events-none max-w-[320px] w-full px-2 sm:px-0">
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-[0_12px_32px_rgba(6,42,87,0.15)] flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-whatsapp/10 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-whatsapp" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-extrabold text-navy leading-tight mb-1">
                {currentEvent.message}
              </p>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                {currentEvent.time}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
