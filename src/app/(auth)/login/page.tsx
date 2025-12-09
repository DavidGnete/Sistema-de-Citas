"use client";

import { ToastContainer, toast } from 'react-toastify';
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [email, setemail] = useState("");
  const [password, setpasswrod] = useState("");
  const route = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // ===== 1. Intentar iniciar sesión  =====
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }

      // ===== 2. Obtener la sesión actualizada =====
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (!role) {
        toast.error("Error interno: usuario sin rol");
        return;
      }

      // ===== 3. Redirigir según rol =====
      if (role === "agent") {
        return route.push("/agent/dashboard");
      }

      return route.push("/client/dashboard");

    } catch (error) {
      console.log(error);
      toast.error("usuario no registrado");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Ingresa a la plataforma</h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="ingresa email"
          />

          <input
            onChange={(e) => setpasswrod(e.target.value)}
            type="password"
            placeholder="password"
          />

          <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded border-t-4 border-green-400 cursor-pointer">
            Sign In
          </button>

          <Link className="text-sm mt-3 text-right" href={"/register"}>
            ¿No tienes cuenta? <span className="underline">Registrate </span>
          </Link>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
