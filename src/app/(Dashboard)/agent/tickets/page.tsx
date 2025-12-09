"use client";
// Página de tickets del agente que muestra la lista de todos los tickets
// Utiliza el componente TicketsList que carga y filtra los tickets desde la API

import React from "react";
import TicketsList from "@/components/tickets/TicketsList";

export default function AgentTicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      {/* Renderizo el componente TicketsList que trae todos los tickets desde la API */}
      <TicketsList />
    </div>
  );
}
