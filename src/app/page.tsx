// Página de inicio que redirecciona según autenticación y rol del usuario
// Si no está autenticado → login
// Si es agente → dashboard del agente
// Si es cliente → dashboard del cliente

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/models/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Obtengo la sesión actual del servidor con NextAuth
  const session = (await getServerSession(authOptions as any)) as any;

  // Si no hay sesión activa, mando al usuario al login
  if (!session) {
    return redirect("/login");
  }

  // Extraigo el rol del usuario (agente o cliente)
  const role = (session.user as any)?.role || "client";

  // Redirijo según el rol: agentes van a su dashboard, clientes al suyo
  if (role === "agent") {
    return redirect("/agent/dashboard");
  }

  return redirect("/client/dashboard");
}
