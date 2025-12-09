
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
  const session = await getServerSession(authOptions as any);
  if (!session) return redirect("/login");

  const { id } = await params;

  await connectToDatabase();

  const ticket = await Ticket.findById(id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .lean();

  if (!ticket) {
    return <div className="text-center py-8">Ticket no encontrado</div>;
  }

  // Serializar el ticket para evitar errores con objetos de MongoDB
  const serializedTicket = JSON.parse(JSON.stringify(ticket));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TicketDetailsClient ticket={serializedTicket} />
      <CommentsClient ticketId={id} />
    </div>
  );
}

