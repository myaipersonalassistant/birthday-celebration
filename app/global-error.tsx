"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 min-h-screen bg-[#061c2b] font-sans antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center text-white">
          <p
            style={{
              letterSpacing: "0.22em",
              color: "#d8ad61",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              marginTop: "1rem",
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 500,
            }}
          >
            A quiet pause
          </h1>
          <p
            style={{
              marginTop: "1rem",
              maxWidth: "28rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            The celebration site hit an unexpected issue. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              background: "#d8ad61",
              color: "#102536",
              border: "none",
              padding: "0.9rem 1.5rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
