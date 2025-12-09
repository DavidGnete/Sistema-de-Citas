"use client";
import React from "react";
import TicketsList from "@/components/tickets/TicketsList";

export default function AgentTicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <TicketsList />
    </div>
  );
}
