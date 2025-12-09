"use client";

// Página de login donde los usuarios ingresan con email y contraseña
// Se valida contra la base de datos y se crea una sesión
// Luego se redirije al dashboard según el rol (agente o cliente)

import { ToastContainer, toast } from 'react-toastify';
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  // Estados para guardar el email y contraseña del usuario
  const [email, setemail] = useState("");
  const [password, setpasswrod] = useState("");
  const route = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Paso 1: Envío las credenciales a NextAuth para validar
      // redirect: false significa que no redirige automáticamente
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }

      // Paso 2: Obtengo la sesión actualizada para ver el rol del usuario
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (!role) {
        toast.error("Error interno: usuario sin rol");
        return;
      }

      // Paso 3: Redirijo según el rol
      // Si es agente → dashboard del agente
      // Si es cliente → dashboard del cliente
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
