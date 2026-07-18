import type { RsvpSubmission } from "@/app/actions/admin-rsvp";

const countryLabels: Record<string, string> = {
  spain: "Spain",
  nigeria: "Nigeria",
  uk: "United Kingdom",
  usa: "United States",
  other: "Other",
};

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildRsvpCsv(rows: RsvpSubmission[]) {
  const headers = [
    "First name",
    "Last name",
    "Email",
    "Phone",
    "Country",
    "Attend dinner",
    "Join cruise",
    "Bringing guest",
    "Guest name",
    "Message",
    "Submitted at",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.firstName,
        row.lastName,
        row.email,
        row.phone ?? "",
        countryLabels[row.country] ?? row.country,
        row.attendDinner ? "Yes" : "No",
        row.joinCruise ? "Yes" : "No",
        row.bringingGuest ? "Yes" : "No",
        row.guestName ?? "",
        row.message ?? "",
        row.createdAt,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  return `\uFEFF${lines.join("\n")}`;
}

export function downloadRsvpCsv(rows: RsvpSubmission[], filename?: string) {
  const csv = buildRsvpCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `rsvp-export-${stamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
