import { NextResponse } from "next/server";
import { connectToDatabase} from "@/lib/mongobd";
import { Comment } from "@/models/comment";
import { Ticket } from "@/models/ticket";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { ticketId, author, message } = body;

    if (!ticketId || !author || !message) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el ticket existe
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { ok: false, message: "El ticket no existe" },
        { status: 404 }
      );
    }

    console.log(`Creating comment for ticket ${ticketId} by author ${author}`);

    const newComment = await Comment.create({
      ticketId,
      author,
      message,
    });

    const populatedComment = await newComment.populate("author", "name role email");
    
    // Serializar para evitar problemas con objetos de MongoDB
    const serializedComment = JSON.parse(JSON.stringify(populatedComment));

    return NextResponse.json({ ok: true, comment: serializedComment });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
