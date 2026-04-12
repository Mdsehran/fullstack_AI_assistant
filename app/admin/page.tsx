// app/admin/page.tsx  — top of the file
import { cookies } from "next/headers";
import { requireAdmin } from "@/access/project.access";
import { connectDB } from "@/lib/mongodb";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  await connectDB();

  try {
    await requireAdmin("user-123", "123"); // swap with real session later
  } catch {
    redirect("/unauthorized");
  }

}