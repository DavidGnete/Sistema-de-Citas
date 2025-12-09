// Página de detalle de un ticket específico para el agente
// El agente puede ver todos los detalles y comentarios del ticket
// También puede editar el estado, prioridad y asignar el ticket

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/models/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongobd";
import { Ticket } from "@/models/ticket";
import CommentsClient from "@/components/comments/CommentsClient";
import TicketDetailsClient from "@/components/tickets/TicketDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentTicketPage({ params }: Props) {
  // Verifico que el usuario esté autenticado
  const session = await getServerSession(authOptions as any);
  if (!session) return redirect("/login");

  // Obtengo el ID del ticket desde los parámetros dinámicos
  const { id } = await params;

  // Conecto a la base de datos
  await connectToDatabase();

  // Busco el ticket por ID y cargo los datos del creador y el agente asignado
  const ticket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .lean();

  // Si el ticket no existe, muestro un mensaje de error
  if (!ticket) {
    return <div className="text-center py-8">Ticket no encontrado</div>;
  }

  // Serializo el ticket para evitar problemas con objetos de Mongoose en cliente
  const serializedTicket = JSON.parse(JSON.stringify(ticket));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Componente que muestra los detalles del ticket y permite editarlos */}
      <TicketDetailsClient ticket={serializedTicket} />
      {/* Componente que muestra los comentarios y permite agregar nuevos */}
      <CommentsClient ticketId={id} />
    </div>
  );
}

