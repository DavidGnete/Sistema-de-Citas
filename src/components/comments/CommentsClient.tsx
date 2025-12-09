"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

// Paso 1: cargar los comentarios del ticket desde `/api/comments/:ticketId`.
// Paso 2: refrescar cada 3 segundos para ver nuevos comentarios.
// Paso 3: permitir enviar un nuevo comentario (usa la sesión para el autor).
// Paso 4: después de enviar, limpiar el input y recargar la lista.
export default function CommentsClient({ ticketId }: { ticketId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Función: pedir comentarios al servidor y guardarlos en estado.
  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments/${ticketId}`);
      if (res.data?.ok) setComments(res.data.comments || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar comentarios");
    }
  };

  useEffect(() => {
    // Paso: cargar los comentarios al montar y comenzar el polling.
    fetchComments();
    const interval = setInterval(fetchComments, 3000);
    return () => clearInterval(interval);
  }, [ticketId]);

  // Función: enviar un comentario nuevo al endpoint POST /api/comments.
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }

    try {
      setLoading(true);
      const body = {
        ticketId,
        author: (session?.user as any)?.id,
        message: message.trim(),
      };
      const res = await api.post(`/api/comments`, body);
      if (res.data?.ok) {
        // Paso: si se guardó, limpiar input y recargar comentarios.
        setMessage("");
        toast.success("Comentario agregado");
        await fetchComments();
      } else {
        toast.error(res.data?.message || "Error al agregar comentario");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error al agregar comentario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-xl font-bold mb-4">Comentarios</h3>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border-l-4 border-blue-600 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{c.author?.name || "Usuario"}</h4>
                  <p className="text-xs text-gray-500">
                    {c.author?.role === "agent" ? "🔧 Agente" : "👤 Cliente"}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{c.message}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addComment} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          placeholder="Escribe tu comentario..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
