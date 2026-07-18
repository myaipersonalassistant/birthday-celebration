import Image from "next/image";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-[#f7f3eb] px-5 py-16 text-[#0b2638] sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1240px] items-stretch gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_18px_40px_rgba(11,38,56,0.12)] lg:aspect-auto lg:min-h-0 lg:h-full">
          <Image
            src="/angela2.jpg"
            alt="Angela Ifonlaja"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div className="flex max-w-xl flex-col justify-center lg:justify-self-start">
          <p className="text-xs font-bold tracking-[0.22em] text-[#c99b4e] uppercase sm:text-sm">
            About Angela
          </p>

          <h2
            id="about-heading"
            className="mt-3 font-logo text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] font-medium tracking-[-0.02em] text-[#0b2638]"
          >
            A Woman of Strength, Dignity &amp; Grace
          </h2>

          <div className="relative mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#c99b4e]" />
            <span aria-hidden="true" className="text-sm leading-none text-[#c99b4e]">
              ♥
            </span>
            <span className="h-px flex-1 bg-[#c99b4e]" />
          </div>

          <p className="mt-6 text-base leading-relaxed text-[#2a3d4a] sm:text-lg">
            Angela is a woman whose life reflects faith, kindness and quiet strength. She leads
            with grace, loves deeply and inspires everyone around her. This celebration is our
            way of honoring the incredible woman she is and the beautiful impact she continues
            to make.
          </p>

          <a
            href="#about-more"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[linear-gradient(180deg,#16384d_0%,#0b2638_100%)] px-10 text-[0.68rem] font-extrabold tracking-[0.18em] text-white uppercase shadow-[0_10px_24px_rgba(11,38,56,0.22)] transition-opacity hover:opacity-90 sm:w-fit sm:self-start"
          >
            Read More
          </a>
        </div>
      </div>
    </section>
  );
}
