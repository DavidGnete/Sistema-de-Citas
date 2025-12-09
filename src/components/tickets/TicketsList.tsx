"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ToastContainer, toast } from "react-toastify";

export default function TicketsList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const res = await api.get("/api/tickets", { params });
      if (res.data?.ok) setTickets(res.data.tickets || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority]);

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
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Filtrar por Estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todos los estados</option>
            <option value="open">Abiertos</option>
            <option value="in_progress">En Progreso</option>
            <option value="resolved">Resueltos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Filtrar por Prioridad
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todas las prioridades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-600">No hay tickets con estos filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              href={`/agent/tickets/${t._id}`}
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
                  <div className="flex gap-3 items-center mt-3 text-xs text-gray-600">
                    <span>
                      👤 {t.createdBy?.name || "Cliente"}
                    </span>
                    <span>📅 {new Date(t.createdAt).toLocaleDateString("es-ES")}</span>
                    {t.assignedTo && (
                      <span className="text-blue-600 font-semibold">
                        🔧 Asignado: {t.assignedTo?.name}
                      </span>
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
