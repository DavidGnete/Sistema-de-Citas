"use client"
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"
import { useRouter } from "next/navigation";

export default function RegisterForm() {

  const [name, setname] =useState("");
    const [cc, setcc]= useState("");
  const [email, setemail]= useState("");
  const [password, setpasswrod]= useState("");
  const [role , setrole]= useState("client");
  const route = useRouter()


  const handleSubmit = async (e:any) =>{
    e.preventDefault();

    if (!name || !email || !cc || !password || !role) {
      toast.error("completa todos los campos")
      return;
    }
    try {
    const res = await axios.post("/api/register",{name,cc,email,password,role})

    toast.success("Gracias por registrarte");
      
    if (res){
      const form = e.target;
      form.reset();
      route.push("/")
    }

    }catch(error){
      console.log(error);
      toast.error("Error al registrar usuario");

    }

  }

      return (
        <div className="grid place-items-center h-screen">
          <div className="shadow-lg p-5  border-t-4 border-green-400">
            <h1 className="text-xl font-bold my-4">Registrate</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input
                onChange={(e)=> setname(e.target.value)}
                type="text" 
                placeholder="Nombre Completo"></input>
                <input
                onChange={(e)=> setcc(e.target.value)}
                type="number" 
                placeholder="numero de cedula"></input>
                <input
                onChange={(e)=> setemail(e.target.value)}
                type="email" 
                placeholder="ingresa email"></input>

                <input
                onChange={(e)=> setpasswrod(e.target.value)}
                type="password"
                placeholder="password" 
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Selecciona tu rol:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="client"
                        checked={role === "client"}
                        onChange={(e) => setrole(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Cliente (Usuario)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="agent"
                        checked={role === "agent"}
                        onChange={(e) => setrole(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Agente de soporte</span>
                    </label>
                  </div>
                </div>
                
                <button
                type="submit"
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded border-t-4 border-green-400 cursor-pointer"
                >
                Registrate
                </button>
        
                <Link className="text-sm mt-3 text-right" href={"/login"}>
                    ¿Ya tienes cuenta? <span className="underline">Inicia Sesion </span>
                </Link>
            </form>
            </div>
            <ToastContainer />
      
        </div>
        
      );
}