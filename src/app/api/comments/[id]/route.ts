import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongobd";
import { Comment } from "@/models/comment";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const comments = await Comment.find({ ticketId: id })
      .populate("author", "name role email")
      .sort({ createdAt: 1 }); // orden cronológico

    console.log(`Fetched ${comments.length} comments for ticket ${id}`);
    
    // Serializar comentarios para evitar problemas con objetos de MongoDB
    const serializedComments = JSON.parse(JSON.stringify(comments));
    
    return NextResponse.json({ ok: true, comments: serializedComments });
  } catch (error: any) {
    console.error("GET /api/comments/:id error:", error);
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
