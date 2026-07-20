import Image from "next/image";
import Link from "next/link";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186 31.247 31.247 0 0 0 0 12a31.31 31.31 0 0 0 .502 5.814 3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136A31.247 31.247 0 0 0 24 12a31.237 31.237 0 0 0-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
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

const WHATSAPP_NUMBER = "+447947945639";
const WHATSAPP_LINK = "https://wa.me/447947945639";
const INSTAGRAM_LINK = "https://www.instagram.com/angelaifonlaja";
const YOUTUBE_LINK = "https://youtube.com/@itschrisandangela";

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
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${WHATSAPP_NUMBER}`}
              className="grid size-11 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.35)] transition-all hover:scale-105 hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @angelaifonlaja"
              className="grid size-11 place-items-center rounded-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] text-white shadow-[0_8px_20px_rgba(188,24,136,0.35)] transition-all hover:scale-105"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={YOUTUBE_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube @itschrisandangela"
              className="grid size-11 place-items-center rounded-full bg-[#FF0000] text-white shadow-[0_8px_20px_rgba(255,0,0,0.3)] transition-all hover:scale-105 hover:bg-[#e60000]"
            >
              <YouTubeIcon className="size-5" />
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
              href={`tel:${WHATSAPP_NUMBER}`}
              className="flex items-center justify-center gap-3 transition-colors hover:text-[#d8ad61] lg:justify-start"
            >
              <PhoneIcon className="size-4 shrink-0 text-[#d8ad61]" />
              {WHATSAPP_NUMBER}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:items-end lg:text-right">
          <Link href="/" aria-label="Celebrate Angela—home" className="block">
            <Image
              src="/logobg.png"
              alt="Celebrate Angela Ifonlaja"
              width={220}
              height={260}
              className="h-28 w-auto object-contain mix-blend-screen sm:h-32"
            />
          </Link>
          <p className="font-script text-xl text-[#d8ad61] sm:text-[1.5rem]">
            Made with love for Angela{" "}
            <span
              aria-hidden="true"
              className="ml-1 inline-block align-middle text-3xl leading-none"
            >
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
