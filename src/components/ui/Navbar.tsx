"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Links() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = (session?.user as any)?.role || "client";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!mounted || !session) return null;

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          HelpDesk Pro
        </Link>

        <nav className="flex gap-6 items-center">
          {role === "agent" ? (
            <>
              <Link href="/agent/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link href="/agent/tickets" className="hover:text-blue-200">
                Tickets
              </Link>
            </>
          ) : (
            <>
              <Link href="/client/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link href="/client/tickets" className="hover:text-blue-200">
                Mis Tickets
              </Link>
              <Link href="/client/tickets/create" className="hover:text-blue-200">
                Nuevo Ticket
              </Link>
            </>
          )}

          <div className="border-l pl-6">
            <p className="text-sm mb-1">{session.user?.name}</p>
            <button
              onClick={handleLogout}
              className="text-sm hover:text-blue-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}