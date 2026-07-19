import Link from "next/link";
import type { AdminAnalyticsData, AnalyticsBar } from "@/app/actions/admin-analytics";

function BarList({
  rows,
  emptyLabel,
}: {
  rows: AnalyticsBar[];
  emptyLabel: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  if (total === 0) {
    return <p className="text-sm text-[#4a5d6a]">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const width = Math.round((row.count / max) * 100);
        const share = Math.round((row.count / total) * 100);
        return (
          <li key={row.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm text-[#2f4452]">{row.label}</span>
              <span className="font-logo text-xl tabular-nums text-[#061c2b]">
                {row.count}
                <span className="ml-1.5 text-xs tracking-[0.08em] text-[#8a7a5c] uppercase">
                  {share}%
                </span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden bg-[#ebe4d8]">
              <div
                className="h-full bg-[#d8ad61] transition-all duration-700"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

type AdminAnalyticsPanelProps = {
  data: AdminAnalyticsData;
};

export function AdminAnalyticsPanel({ data }: AdminAnalyticsPanelProps) {
  const timelineMax = Math.max(
    1,
    ...data.timeline.map((day) => day.rsvps + day.menus + day.guestbook),
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden border border-[#061c2b] bg-[#061c2b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(216,173,97,0.22),transparent_42%),radial-gradient(circle_at_90%_80%,rgba(216,173,97,0.1),transparent_38%)]" />
        <div className="relative px-5 py-6 sm:px-7 sm:py-8">
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
            Insights
          </p>
          <h2 className="mt-1 font-logo text-3xl tracking-[-0.02em] sm:text-4xl">
            Celebration analytics
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/55">
            Purobeach · Hilton dinner &amp; catamaran RSVPs, evening menu counts,
            guestbook, and studio health.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "RSVPs", value: data.totals.rsvps },
              { label: "Headcount", value: data.totals.headcount },
              { label: "Menu choices", value: data.totals.menus },
              { label: "Guestbook", value: data.totals.guestbook },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <p className="text-[0.6rem] font-bold tracking-[0.14em] text-white/40 uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-logo text-3xl tabular-nums text-[#d8ad61]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {data.menuToRsvpRatio != null && (
            <p className="mt-5 text-sm text-white/60">
              Menu submissions are{" "}
              <span className="font-semibold text-[#d8ad61]">
                {data.menuToRsvpRatio}%
              </span>{" "}
              of RSVP count (not matched person-to-person)
              {data.totals.dietaryNotes > 0
                ? ` · ${data.totals.dietaryNotes} dietary note${
                    data.totals.dietaryNotes === 1 ? "" : "s"
                  }`
                : ""}
              .
            </p>
          )}
        </div>
      </section>

      {data.warnings.length > 0 && (
        <aside
          role="note"
          className="border border-[#d8ad61]/45 bg-[#fff8eb] px-5 py-4 text-sm text-[#5c4a28] sm:px-6"
        >
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#8a6a2e] uppercase">
            Data notes
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {data.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </aside>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Attendance</p>
              <p className="text-xs font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                Purobeach · Hilton dinner · marina cruise · plus-ones
              </p>
            </div>
            <Link
              href="/admin/rsvp"
              className="text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b]/60 uppercase transition hover:text-[#d8ad61]"
            >
              RSVPs →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Dinner", value: data.totals.dinner },
              { label: "Catamaran", value: data.totals.cruise },
              { label: "Plus-ones", value: data.totals.plusOnes },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[#ebe4d8] bg-[#fbf8f2] px-3 py-3 text-center"
              >
                <p className="text-[0.58rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-logo text-2xl text-[#061c2b]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-3 text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
              By country
            </p>
            <BarList
              rows={data.countries}
              emptyLabel="No RSVP country data yet."
            />
          </div>
        </section>

        <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Studio</p>
              <p className="text-xs font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                Media health
              </p>
            </div>
            <Link
              href="/admin/studio"
              className="text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b]/60 uppercase transition hover:text-[#d8ad61]"
            >
              Studio →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Live", value: data.totals.galleryLive },
              { label: "Drafts", value: data.totals.galleryDrafts },
              { label: "Photos", value: data.totals.galleryPhotos },
              { label: "Videos", value: data.totals.galleryVideos },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[#ebe4d8] bg-[#fbf8f2] px-3 py-3"
              >
                <p className="text-[0.58rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-logo text-2xl text-[#061c2b]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Mains</p>
              <p className="text-xs font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                Kitchen demand
              </p>
            </div>
            <Link
              href="/admin/menu"
              className="text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b]/60 uppercase transition hover:text-[#d8ad61]"
            >
              Menu →
            </Link>
          </div>
          <div className="mt-5">
            <BarList rows={data.mains} emptyLabel="No main course choices yet." />
          </div>
        </section>

        <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Desserts</p>
              <p className="text-xs font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                Sweet counts
              </p>
            </div>
            <Link
              href="/admin/menu"
              className="text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b]/60 uppercase transition hover:text-[#d8ad61]"
            >
              Menu →
            </Link>
          </div>
          <div className="mt-5">
            <BarList
              rows={data.desserts}
              emptyLabel="No dessert choices yet."
            />
          </div>
        </section>
      </div>

      <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
        <p className="font-script text-2xl text-[#c99b4e]">Last 14 days</p>
        <p className="text-xs font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
          RSVPs · Menu · Guestbook
        </p>

        <div className="mt-6 flex items-end gap-1.5 overflow-x-auto pb-2 sm:gap-2">
          {data.timeline.map((day) => {
            const total = day.rsvps + day.menus + day.guestbook;
            const height = Math.max(
              8,
              Math.round((total / timelineMax) * 140),
            );
            const rsvpH =
              total === 0 ? 0 : Math.round((day.rsvps / total) * height);
            const menuH =
              total === 0 ? 0 : Math.round((day.menus / total) * height);
            const guestbookH = Math.max(0, height - rsvpH - menuH);

            return (
              <div
                key={day.date}
                className="flex min-w-[2.1rem] flex-1 flex-col items-center gap-2"
                title={`${day.label}: ${day.rsvps} RSVP, ${day.menus} menu, ${day.guestbook} guestbook`}
              >
                <div
                  className="flex w-full max-w-[28px] flex-col justify-end overflow-hidden bg-[#f3eee4]"
                  style={{ height: 140 }}
                >
                  <div className="w-full bg-[#061c2b]" style={{ height: rsvpH }} />
                  <div className="w-full bg-[#d8ad61]" style={{ height: menuH }} />
                  <div
                    className="w-full bg-[#8a7a5c]"
                    style={{ height: guestbookH }}
                  />
                </div>
                <p className="text-[0.55rem] tracking-[0.04em] text-[#8a7a5c]">
                  {day.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-[0.65rem] font-bold tracking-[0.1em] uppercase">
          <span className="inline-flex items-center gap-2 text-[#061c2b]">
            <span className="size-2.5 bg-[#061c2b]" /> RSVP
          </span>
          <span className="inline-flex items-center gap-2 text-[#8a6a2e]">
            <span className="size-2.5 bg-[#d8ad61]" /> Menu
          </span>
          <span className="inline-flex items-center gap-2 text-[#8a7a5c]">
            <span className="size-2.5 bg-[#8a7a5c]" /> Guestbook
          </span>
        </div>
      </section>
    </div>
  );
}
