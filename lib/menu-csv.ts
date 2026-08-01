import type { MenuSubmission } from "@/app/actions/admin-menu";
import { getMenuById } from "@/lib/menu-data";

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function courseChoiceNames(
  courses: MenuSubmission["courses"],
  courseId: string,
) {
  const choices = courses[courseId] ?? [];
  return choices.map((item) => item.name).join("; ");
}

export function buildMenuCsv(rows: MenuSubmission[]) {
  const menu = getMenuById("premium");
  const choiceCourses = menu.courses.filter(
    (course) => course.selection === "single",
  );

  const headers = [
    "Guest name",
    "Email",
    "Menu",
    ...choiceCourses.map((course) => course.title),
    "Dietary notes",
    "Submitted at",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.guestName,
        row.email ?? "",
        row.menuTitle,
        ...choiceCourses.map((course) =>
          courseChoiceNames(row.courses, course.id),
        ),
        row.dietaryNotes ?? "",
        row.createdAt,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  return `\uFEFF${lines.join("\n")}`;
}

export function downloadMenuCsv(rows: MenuSubmission[], filename?: string) {
  const csv = buildMenuCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `menu-export-${stamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
