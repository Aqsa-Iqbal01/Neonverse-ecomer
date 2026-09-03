import type { Metadata } from "next";
import { AdminLayout as AdminShell } from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "Admin",
  description: "NEONVERSE admin panel.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
