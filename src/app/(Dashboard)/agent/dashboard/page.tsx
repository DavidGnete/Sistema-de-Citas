import { Ticket as TicketModel } from "@/models/ticket";
import { connectToDatabase } from "@/lib/mongobd";

export default async function AgentDashboardPage() {
  await connectToDatabase();

  const tickets = await TicketModel.find({}).lean();

  const counts = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  } as Record<string, number>;

  tickets.forEach((t: any) => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Resumen de Tickets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Abiertos</h3>
          <p className="text-3xl font-semibold">{counts.open}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">En Progreso</h3>
          <p className="text-3xl font-semibold">{counts.in_progress}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Resueltos</h3>
          <p className="text-3xl font-semibold">{counts.resolved}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Cerrados</h3>
          <p className="text-3xl font-semibold">{counts.closed}</p>
        </div>
      </div>
    </div>
  );
}
