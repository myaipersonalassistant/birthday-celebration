import Image from "next/image";

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span aria-hidden="true" className="absolute top-0 left-0 h-5 w-5 border-t border-l border-[#c99b4e]" />
      <span aria-hidden="true" className="absolute top-0 right-0 h-5 w-5 border-t border-r border-[#c99b4e]" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#c99b4e]" />
      <span aria-hidden="true" className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-[#c99b4e]" />
      {children}
    </div>
  );
}

export function FindUsSection() {
  const mapEmbedUrl =
    "https://maps.google.com/maps?q=Purobeach%20Barcelona%20Hilton%20Diagonal%20Mar&z=15&output=embed";

  return (
    <section
      id="find-us"
      aria-labelledby="find-us-heading"
      className="bg-[#f7f3eb] px-5 py-10 text-[#0b2638] sm:px-8 sm:py-12 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <h2
            id="find-us-heading"
            className="font-logo text-2xl font-semibold tracking-[0.14em] uppercase sm:text-3xl"
          >
            Before You Arrive
          </h2>
          <div className="mx-auto mt-3 h-px w-12 bg-[#c99b4e]" />
        </div>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)]">
          <div className="mx-auto flex w-full max-w-[240px] flex-col items-center lg:mx-0">
            <Frame className="w-full border border-[#d8cfbf] bg-white p-5">
              <Image
                src="/QR.png"
                alt="QR code to RSVP"
                width={220}
                height={220}
                className="mx-auto h-auto w-full object-contain"
              />
            </Frame>
            <p className="mt-3 text-[0.65rem] font-bold tracking-[0.18em] text-[#0b2638]/70 uppercase">
              Scan to RSVP
            </p>
          </div>

          <div className="flex min-w-0 flex-col">
            <Frame className="flex-1 border border-[#d8cfbf] bg-white p-2 sm:p-3">
              <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:h-full lg:min-h-[320px]">
                <iframe
                  title="Map to Purobeach Barcelona"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </Frame>
            <a
              href="https://maps.google.com/?q=Purobeach+Barcelona+Hilton+Diagonal+Mar"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[0.65rem] font-bold tracking-[0.16em] text-[#0b2638] uppercase underline-offset-4 transition-colors hover:text-[#c99b4e] hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
