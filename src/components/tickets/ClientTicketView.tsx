"use client";
import React from "react";
import Badge from "@/components/ui/Badge";

export default function ClientTicketView({ ticket }: any) {
  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{ticket.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Creado el {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{ticket.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Estado</h4>
          <Badge
            color={
              ticket.status === "open"
                ? "blue"
                : ticket.status === "in_progress"
                  ? "yellow"
                  : ticket.status === "resolved"
                    ? "green"
                    : "gray"
            }
          >
            {ticket.status === "open"
              ? "Abierto"
              : ticket.status === "in_progress"
                ? "En Progreso"
                : ticket.status === "resolved"
                  ? "Resuelto"
                  : "Cerrado"}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Prioridad</h4>
          <Badge
            color={
              ticket.priority === "high"
                ? "red"
                : ticket.priority === "medium"
                  ? "yellow"
                  : "gray"
            }
          >
            {ticket.priority === "high"
              ? "Alta"
              : ticket.priority === "medium"
                ? "Media"
                : "Baja"}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Asignado a</h4>
          <p className="text-sm">
            {ticket.assignedTo?.name || "Sin asignar"}
          </p>
        </div>
      </div>
    </div>
  );
}
