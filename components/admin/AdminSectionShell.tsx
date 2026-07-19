import Link from "next/link";

type AdminSectionShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  publicHref?: string;
  publicLabel?: string;
  children?: React.ReactNode;
};

export function AdminSectionShell({
  eyebrow,
  title,
  description,
  publicHref,
  publicLabel = "Open public page",
  children,
}: AdminSectionShellProps) {
  return (
    <div className="mx-auto max-w-5xl animate-[fadeIn_0.45s_ease-out]">
      <p className="text-xs font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
        {eyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-logo text-4xl text-[#061c2b] sm:text-5xl">{title}</h1>
        {publicHref && (
          <Link
            href={publicHref}
            className="text-sm tracking-[0.08em] text-[#061c2b]/70 uppercase transition hover:text-[#d8ad61]"
          >
            {publicLabel} →
          </Link>
        )}
      </div>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
          {description}
        </p>
      ) : null}
      <div className={description ? "mt-8" : "mt-6"}>{children}</div>
    </div>
  );
}
