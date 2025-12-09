export function buildTicketCreatedEmail(ticket: any) {
  const createdAtStr = new Date(ticket.createdAt).toLocaleString("es-ES");
  const subject = `Nuevo ticket creado: ${ticket.title}`;
  const text = `Se ha creado un ticket.\n\nTítulo: ${ticket.title}\nDescripción: ${ticket.description}\nPrioridad: ${ticket.priority}\nEstado: ${ticket.status}\nID: ${ticket._id}\nFecha: ${createdAtStr}`;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111;">
      <h2>Nuevo ticket creado</h2>
      <p><strong>Título:</strong> ${ticket.title}</p>
      <p><strong>Descripción:</strong><br/>${ticket.description}</p>
      <p><strong>Prioridad:</strong> ${ticket.priority}</p>
      <p><strong>Estado inicial:</strong> ${ticket.status}</p>
      <p><strong>ID del ticket:</strong> ${ticket._id}</p>
      <p><strong>Fecha de creación:</strong> ${createdAtStr}</p>
      <hr />
      <p style="font-size:12px; color:#666;">Este correo fue generado automáticamente.</p>
    </div>
  `;

  return { subject, text, html };
}
