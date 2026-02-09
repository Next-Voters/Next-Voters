import { redirect } from "next/navigation";

export default function WeeklyPage() {
  // Alias route: keep marketing URLs short and memorable.
  // Match the current Civic Line entrypoint.
  redirect("/next-voters-line");
}

