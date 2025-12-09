import { getServerSession } from "next-auth/next";
import { authOptions } from "@/models/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    return redirect("/login");
  }

  const role = (session.user as any)?.role || "client";

  if (role === "agent") {
    return redirect("/agent/dashboard");
  }

  return redirect("/client/dashboard");
}
