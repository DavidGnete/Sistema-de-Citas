import { NextResponse } from "next/server";
import { Ticket } from "@/models/ticket";
import { connectToDatabase } from "@/lib/mongobd";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const userId = searchParams.get("userId");

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (userId) query.createdBy = userId;

    console.log("Query tickets:", query);

    const tickets = await Ticket.find(query)
      .populate("createdBy", "name role email")
      .populate("assignedTo", "name role email")
      .sort({ createdAt: -1 });

    console.log("Tickets found:", tickets.length);

    return NextResponse.json({ ok: true, tickets });
  } catch (error: any) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json(
      { ok: false, message: error.message, error: error.toString() },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, description, createdBy, priority } = body;

    if (!title || !description || !createdBy) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy,
      priority: priority || "medium",
    });

    return NextResponse.json({ ok: true, ticket: newTicket });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
