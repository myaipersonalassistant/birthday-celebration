function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.1-1.1 1.2-1.1H17V3h-2.3C11.8 3 11 4.7 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.4l.4-2.8h-2.8Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3.2A8.3 8.3 0 0 0 5.1 15.7L4 20l4.4-1.1A8.3 8.3 0 1 0 12 3.2Zm4.8 11.8c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.1.3.6 1.1 1.3 1.7.9.8 1.6 1.1 1.9 1.2.3.1.5.1.7-.1l.9-1.1c.2-.2.4-.2.6-.1l1.8.8c.2.1.4.2.4.4 0 .2 0 .9-.2 1.5Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M8.2 4.8c.4-.4.9-.5 1.4-.3l2.1.9c.6.2.9.9.7 1.5l-.6 1.8c-.1.4 0 .8.3 1.1l2.9 2.9c.3.3.7.4 1.1.3l1.8-.6c.6-.2 1.3.1 1.5.7l.9 2.1c.2.5.1 1.1-.3 1.4l-1.3 1.3c-.5.5-1.2.7-1.9.6-2-.3-4.8-1.5-7.3-4S5.7 10.6 5.4 8.6c-.1-.7.1-1.4.6-1.9l1.3-1.3-.1-.6Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#061c2b] px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="text-center lg:text-left">
          <p className="font-script text-xl leading-snug text-[#d8ad61] sm:text-[1.7rem]">
            <span className="block whitespace-nowrap">
              Strength and dignity are her clothing;
            </span>
            <span className="block whitespace-nowrap">
              she laughs without fear of the future.
            </span>
          </p>
          <p className="mt-3 whitespace-nowrap text-[0.65rem] font-semibold tracking-[0.18em] text-white/90 uppercase">
            Proverbs 31:25
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase">Let&apos;s Connect</h2>
          <div className="mt-5 flex items-center justify-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-[#d8ad61] text-[#d8ad61] transition-colors hover:bg-[#d8ad61] hover:text-[#061c2b]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-[#d8ad61] text-[#d8ad61] transition-colors hover:bg-[#d8ad61] hover:text-[#061c2b]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://wa.me/447917123456"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid size-10 place-items-center rounded-full border border-[#d8ad61] text-[#d8ad61] transition-colors hover:bg-[#d8ad61] hover:text-[#061c2b]"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase">Questions?</h2>
          <div className="mt-5 space-y-3 text-sm text-white/90">
            <a
              href="mailto:info@chrisandangela.com"
              className="flex items-center justify-center gap-3 transition-colors hover:text-[#d8ad61] lg:justify-start"
            >
              <MailIcon className="size-4 shrink-0 text-[#d8ad61]" />
              info@chrisandangela.com
            </a>
            <a
              href="tel:+447947945639"
              className="flex items-center justify-center gap-3 transition-colors hover:text-[#d8ad61] lg:justify-start"
            >
              <PhoneIcon className="size-4 shrink-0 text-[#d8ad61]" />
              +44-7947-945639
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center text-center lg:justify-end lg:text-right">
          <p className="whitespace-nowrap font-script text-2xl text-[#d8ad61] sm:text-[1.7rem]">
            Made with love for Angela{" "}
            <span aria-hidden="true" className="ml-1 inline-block align-middle text-4xl leading-none sm:text-5xl">
              ♥
            </span>
          </p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[1240px] border-t border-white/10 pt-6 text-center text-[0.7rem] tracking-[0.04em] text-white/70">
        © 2026 Appreciation &amp; Birthday Celebration of Angela Ifonlaja. All Rights Reserved.
      </p>
    </footer>
  );
}
