"use client";
import React, { useState } from "react";
import api from "@/services/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ToastContainer, toast } from "react-toastify";

// Paso 1: recibir `ticket` como prop y guardarlo en estado local `current`.
// Paso 2: mostrar información del ticket (titulo, descripción, creador, fechas).
// Paso 3: permitir editar estado, prioridad y asignado usando select/input.
// Paso 4: al cambiar algo, llamar a la API con `api.put` y actualizar `current`.
export default function TicketDetailsClient({ ticket }: any) {
  // Estado local con el ticket actual que se muestra y edita.
  const [current, setCurrent] = useState(ticket);
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);




  const update = async (data: any) => {
    try {
      setLoading(true);
      const res = await api.put(`/api/tickets/${ticket._id}`, data);
      if (res.data?.ok) {
        setCurrent(res.data.ticket);
        toast.success("Ticket actualizado");
        setEditingField(null);
      } else {
        toast.error(res.data?.message || "Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{current.title}</h2>
        <p className="text-gray-600 mt-2 whitespace-pre-wrap">{current.description}</p>
        <p className="text-xs text-gray-400 mt-4">
          Creado el {new Date(current.createdAt).toLocaleDateString("es-ES")}
        </p>
      </div>

      {/* Información del cliente creador */}
      <div className="border rounded p-4 bg-blue-50">
        <h4 className="text-sm font-bold text-gray-600 mb-3">INFORMACIÓN DEL CLIENTE</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Nombre</p>
            <p className="font-semibold">{current.createdBy?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{current.createdBy?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h4 className="text-sm font-bold text-gray-600 mb-2">ESTADO</h4>
          <div className="flex items-center justify-between">
            <Badge
              color={
                current.status === "open"
                  ? "blue"
                  : current.status === "in_progress"
                    ? "yellow"
                    : current.status === "resolved"
                      ? "green"
                      : "gray"
              }
            >
              {current.status === "open"
                ? "Abierto"
                : current.status === "in_progress"
                  ? "En Progreso"
                  : current.status === "resolved"
                    ? "Resuelto"
                    : "Cerrado"}
            </Badge>
            {editingField === "status" ? (
              <div className="flex gap-2">
                <select
                  defaultValue={current.status}
                  onChange={(e) => update({ status: e.target.value })}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
                <button
                  onClick={() => setEditingField(null)}
                  className="text-xs text-gray-500"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingField("status")}
                className="text-xs text-blue-600 hover:underline"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="border rounded p-4">
          <h4 className="text-sm font-bold text-gray-600 mb-2">PRIORIDAD</h4>
          <div className="flex items-center justify-between">
            <Badge
              color={
                current.priority === "high"
                  ? "red"
                  : current.priority === "medium"
                    ? "yellow"
                    : "gray"
              }
            >
              {current.priority === "high"
                ? "Alta"
                : current.priority === "medium"
                  ? "Media"
                  : "Baja"}
            </Badge>
            {editingField === "priority" ? (
              <div className="flex gap-2">
                <select
                  defaultValue={current.priority}
                  onChange={(e) => update({ priority: e.target.value })}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
                <button
                  onClick={() => setEditingField(null)}
                  className="text-xs text-gray-500"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingField("priority")}
                className="text-xs text-blue-600 hover:underline"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded p-4">
        <h4 className="text-sm font-bold text-gray-600 mb-2">ASIGNADO A</h4>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {current.assignedTo?.name || "Sin asignar"}
          </p>
          {editingField === "assignedTo" ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ID del agente"
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    update({ assignedTo: e.target.value.trim() });
                  } else {
                    update({ assignedTo: undefined });
                  }
                }}
                className="border px-2 py-1 rounded text-sm w-32"
              />
              <button
                onClick={() => setEditingField(null)}
                className="text-xs text-gray-500"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingField("assignedTo")}
              className="text-xs text-blue-600 hover:underline"
            >
              Asignar
            </button>
          )}
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Guardando...</p>}

      <ToastContainer />
    </div>
  );
}
