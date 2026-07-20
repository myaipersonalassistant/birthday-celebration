import type { AdminVisitor } from "@/app/actions/admin-visitors";

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function yesNo(value: boolean | null) {
  if (value == null) return "";
  return value ? "Yes" : "No";
}

export function buildVisitorsCsv(rows: AdminVisitor[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Location",
    "Country",
    "Sources",
    "Attend dinner (Purobeach · Hilton from 6:30 PM)",
    "Join cruise (marina by 1:00 PM)",
    "Interested in MSC Grandiosa (8–15 Aug)",
    "Bringing guest",
    "Guest name",
    "Main",
    "Dessert",
    "Dietary notes",
    "Guestbook message",
    "First seen",
    "Last seen",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.email ?? "",
        row.phone ?? "",
        row.location ?? "",
        row.country ?? "",
        row.sources.join(" · "),
        yesNo(row.attendDinner),
        yesNo(row.joinCruise),
        yesNo(row.interestedMscCruise),
        yesNo(row.bringingGuest),
        row.guestName ?? "",
        row.menuMain ?? "",
        row.menuDessert ?? "",
        row.dietaryNotes ?? "",
        row.guestbookMessage ?? "",
        row.firstSeenAt,
        row.lastSeenAt,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  return `\uFEFF${lines.join("\n")}`;
}

export function downloadVisitorsCsv(rows: AdminVisitor[], filename?: string) {
  const csv = buildVisitorsCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `visitors-export-${stamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
