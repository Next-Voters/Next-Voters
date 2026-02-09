import { redirect } from "next/navigation";

export default function WeeklyPage() {
  // Mirror where `/civic-line` points (currently the Next Voters Line flow).
  redirect("/next-voters-line");
}

