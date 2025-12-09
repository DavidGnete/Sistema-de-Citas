// Página de detalle de un ticket específico para el cliente
// Solo el cliente que creó el ticket puede verlo
// Muestra los detalles y permite agregar comentarios

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/models/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongobd";
import { Ticket } from "@/models/ticket";
import CommentsClient from "@/components/comments/CommentsClient";
import ClientTicketView from "@/components/tickets/ClientTicketView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientTicketPage({ params }: Props) {
  // Verifico que el usuario esté autenticado
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login");

  // Obtengo el ID del ticket desde los parámetros dinámicos
  const { id } = await params;
  const userId = (session.user as any)?.id;

  // Conecto a la base de datos
  await connectToDatabase();

  // Busco el ticket por ID y cargo los datos del creador y el agente asignado
  const ticket = await Ticket.findById(id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .lean();

  // Si el ticket no existe, muestro un mensaje de error
  if (!ticket) {
    return <div className="text-center py-8">Ticket no encontrado</div>;
  }

  // Serializo el ticket para evitar problemas con objetos de Mongoose en cliente
  const serializedTicket = JSON.parse(JSON.stringify(ticket));

  // Verifico que el ticket pertenece al usuario actual (seguridad)
  // Si no es suyo, lo redirijo a la lista de tickets
  if (serializedTicket.createdBy?._id !== userId) {
    return redirect("/client/tickets");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Componente que muestra los detalles del ticket (solo lectura para cliente) */}
      <ClientTicketView ticket={serializedTicket} />
      {/* Componente que muestra los comentarios y permite agregar nuevos */}
      <CommentsClient ticketId={id} />
    </div>
  );
}
