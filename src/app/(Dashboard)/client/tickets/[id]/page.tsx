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
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login");

  const { id } = await params;
  const userId = (session.user as any)?.id;

  await connectToDatabase();

  const ticket = await Ticket.findById(id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .lean();

  if (!ticket) {
    return <div className="text-center py-8">Ticket no encontrado</div>;
  }

  // Serializar el ticket para evitar errores con objetos de MongoDB
  const serializedTicket = JSON.parse(JSON.stringify(ticket));

  // Verificar que el ticket pertenece al usuario
  if (serializedTicket.createdBy?._id !== userId) {
    return redirect("/client/tickets");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ClientTicketView ticket={serializedTicket} />
      <CommentsClient ticketId={id} />
    </div>
  );
}
