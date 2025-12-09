import { getServerSession } from "next-auth/next";
import { authOptions } from "@/models/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import LogoutButton from "@/components/ui/LogoutButton";

export const metadata: Metadata = {
  title: "Dashboard Cliente",
  description: "Panel de soporte para clientes",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session) return redirect("/login");

  const role = (session.user as any)?.role || "client";
  if (role !== "client") return redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Mi Centro de Soporte</h2>
          <nav className="flex gap-6 items-center">
            <Link className="text-sm text-blue-600 hover:underline" href="/client/dashboard">
              Dashboard
            </Link>
            <Link className="text-sm text-blue-600 hover:underline" href="/client/tickets">
              Mis Tickets
            </Link>
            <Link className="text-sm text-blue-600 hover:underline" href="/client/tickets/create">
              Nuevo Ticket
            </Link>
            <div className="border-l pl-4">
              <LogoutButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 w-full">{children}</main>
    </div>
  );
}
