import { NextResponse } from "next/server";
import { Ticket } from "@/models/ticket";
import { connectToDatabase } from "@/lib/mongobd";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "name role email")
      .populate("assignedTo", "name role email");

    if (!ticket) {
      return NextResponse.json(
        { ok: false, message: "Ticket no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, ticket });
  } catch (error: any) {
    console.error("GET /api/tickets/:id error:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { status, priority, assignedTo } = body;

    const updatedFields: any = {};
    if (status) updatedFields.status = status;
    if (priority) updatedFields.priority = priority;
    if (assignedTo) updatedFields.assignedTo = assignedTo;

    updatedFields.updatedAt = new Date();

    console.log(`Updating ticket ${id} with:`, updatedFields);

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    )
      .populate("createdBy", "name role email")
      .populate("assignedTo", "name role email");

    if (!updatedTicket) {
      return NextResponse.json(
        { ok: false, message: "No se pudo actualizar el ticket" },
        { status: 404 }
      );
    }

    // Serializar para evitar problemas con objetos de MongoDB
    const serializedTicket = JSON.parse(JSON.stringify(updatedTicket));

    console.log(`Ticket ${id} updated successfully`);

    return NextResponse.json({ ok: true, ticket: serializedTicket });
  } catch (error: any) {
    console.error("PUT /api/tickets/:id error:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
