"use client";
// Página para crear un nuevo ticket de soporte
// El cliente completa un formulario con título, descripción y prioridad
// Al enviar, se crea el ticket en la BD y se envía un email de confirmación

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function CreateTicketPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones del lado del cliente
    if (!title.trim()) {
      toast.error("Por favor ingresa un título");
      return;
    }

    if (!description.trim()) {
      toast.error("Por favor ingresa una descripción");
      return;
    }

    if (title.trim().length < 5) {
      toast.error("El título debe tener al menos 5 caracteres");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres");
      return;
    }

    try {
      setLoading(true);

      // Envío POST a la API con los datos del ticket
      // createdBy se obtiene de la sesión del usuario
      const res = await axios.post("/api/tickets", {
        title: title.trim(),
        description: description.trim(),
        priority,
        createdBy: (session?.user as any)?.id,
      });

      // Si se creó correctamente, muestro mensaje y redirijo
      if (res.data?.ok) {
        toast.success("Ticket creado, envio a tu correo para más detalles");
        // Espero 3 segundos antes de redirigir para que el usuario vea el mensaje
        setTimeout(() => {
          router.push("/client/tickets");
        }, 3000);
      } else {
        toast.error(res.data?.message || "Error al crear ticket");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al crear ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reportar Nuevo Problema</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-5">
        {/* Campo de título */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Título del Problema *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: No puedo acceder a mi cuenta"
            maxLength={100}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {/* Contador de caracteres */}
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        {/* Campo de descripción */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Descripción Detallada *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema en detalle, incluye pasos para reproducir si aplica"
            rows={6}
            maxLength={1000}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {/* Contador de caracteres */}
          <p className="text-xs text-gray-500 mt-1">{description.length}/1000</p>
        </div>

        {/* Campo de prioridad */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nivel de Prioridad</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="low">Baja - Puede esperar</option>
            <option value="medium"> Media - Moderadamente importante</option>
            <option value="high">Alta - Urgente</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Creando..." : "Crear Ticket"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
