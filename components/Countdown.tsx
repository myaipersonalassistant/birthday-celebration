"use client";

import { useEffect, useState } from "react";

const eventDate = new Date("2026-08-07T19:00:00+02:00").getTime();

function getTimeRemaining() {
  const distance = Math.max(0, eventDate - Date.now());

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

const initialTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function Countdown() {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const updateCountdown = () => setTime(getTimeRemaining());

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4">
      {Object.entries(time).map(([label, value], index) => (
        <div
          key={label}
          className={`px-3 text-center sm:px-8 ${index > 0 ? "border-l border-[#d8ad61]/25" : ""}`}
        >
          <span className="block font-display text-3xl leading-none text-[#e2ba70] sm:text-5xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-[0.5rem] font-bold tracking-[0.16em] text-white/70 uppercase sm:text-[0.6rem]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
