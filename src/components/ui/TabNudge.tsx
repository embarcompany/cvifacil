"use client";

import { useEffect } from "react";

export function TabNudge() {
  useEffect(() => {
    const originalTitle = document.title;
    const alertTitles = [
      "Seu pet está te esperando! 🐶",
      "Volte para iniciar o CVI! ✈️",
      "Não perca os prazos da viagem! 🐱",
    ];
    let titleIndex = 0;
    let intervalId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Cycle through alert titles when the tab is inactive
        intervalId = setInterval(() => {
          document.title = alertTitles[titleIndex];
          titleIndex = (titleIndex + 1) % alertTitles.length;
        }, 3000);
      } else {
        // Restore original title when tab is active
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return null;
}
