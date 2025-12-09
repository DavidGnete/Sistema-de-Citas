"use client";
// Página que muestra la lista de tickets del cliente actual
// Permite filtrar por estado y muestra cada ticket con su información
// El cliente puede ver solo sus propios tickets

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import api from "@/services/api";
import { ToastContainer, toast } from "react-toastify";

export default function ClientTicketsPage() {
  // Obtengo la sesión del usuario actual
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Función para traer los tickets de la API filtrados
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const userId = (session?.user as any)?.id;

      if (!userId) {
        console.error("No userId found in session");
        toast.error("Error: No se encontró el usuario");
        return;
      }

      // Preparo los parámetros: userId es obligatorio, status es opcional
      const params: any = { userId };
      if (status) params.status = status;

      console.log("Fetching tickets with params:", params);
      const res = await api.get("/api/tickets", { params });
      
      console.log("API Response:", res.data);
      
      // Si la API responde OK, seteo los tickets
      if (res.data?.ok) {
        setTickets(res.data.tickets || []);
      } else {
        toast.error(res.data?.message || "Error al cargar tickets");
      }
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  // Traigo los tickets cuando la sesión se carga o cuando cambia el filtro
  useEffect(() => {
    if (session?.user) {
      fetchTickets();
    }
  }, [status, session]);

  // Función auxiliar para mostrar el estado en español
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto";
      case "in_progress":
        return "En Progreso";
      case "resolved":
        return "Resuelto";
      case "closed":
        return "Cerrado";
      default:
        return status;
    }
  };

  // Función auxiliar para mostrar la prioridad en español
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baja";
      case "medium":
        return "Media";
      case "high":
        return "Alta";
      default:
        return priority;
    }
  };

  return (
    <div>
      {/* Encabezado con título y botón para crear nuevo ticket */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Tickets de Soporte</h1>
        <Link
          href="/client/tickets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          + Nuevo Ticket
        </Link>
      </div>

      {/* Filtro por estado */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm font-medium">Filtrar por estado:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="in_progress">En Progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-600 mb-4">No hay tickets reportados.</p>
          <Link
            href="/client/tickets/create"
            className="text-blue-600 hover:underline font-semibold"
          >
            Crear el primer ticket →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              href={`/client/tickets/${t._id}`}
              className="block p-5 bg-white border border-gray-200 rounded hover:border-blue-600 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="flex gap-2 items-center mt-3 text-xs text-gray-500">
                    <span>📅 {new Date(t.createdAt).toLocaleDateString("es-ES")}</span>
                    {t.assignedTo && (
                      <span>👤 Asignado a: {t.assignedTo?.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                  <Badge
                    color={
                      t.priority === "high"
                        ? "red"
                        : t.priority === "medium"
                          ? "yellow"
                          : "gray"
                    }
                  >
                    {getPriorityLabel(t.priority)}
                  </Badge>
                  <Badge
                    color={
                      t.status === "open"
                        ? "blue"
                        : t.status === "in_progress"
                          ? "yellow"
                          : t.status === "resolved"
                            ? "green"
                            : "gray"
                    }
                  >
                    {getStatusLabel(t.status)}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
