import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tipos
export interface ITicket {
  _id: string;
  title: string;
  description: string;
  createdBy: string | any;
  assignedTo?: string | any;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  ticketId: string;
  author: string | any;
  message: string;
  createdAt: Date;
}

// Tickets API
export const ticketService = {
  async getTickets(filters?: {
    status?: string;
    priority?: string;
    userId?: string;
  }) {
    const res = await api.get("/api/tickets", { params: filters });
    return res.data;
  },

  async getTicketById(id: string) {
    const res = await api.get(`/api/tickets/${id}`);
    return res.data;
  },

  async createTicket(data: {
    title: string;
    description: string;
    priority?: string;
    createdBy: string;
  }) {
    const res = await api.post("/api/tickets", data);
    return res.data;
  },

  async updateTicket(
    id: string,
    data: {
      status?: string;
      priority?: string;
      assignedTo?: string;
    }
  ) {
    const res = await api.put(`/api/tickets/${id}`, data);
    return res.data;
  },
};

// Comments API
export const commentService = {
  async getCommentsByTicket(ticketId: string) {
    const res = await api.get(`/api/comments/${ticketId}`);
    return res.data;
  },

  async createComment(data: {
    ticketId: string;
    author: string;
    message: string;
  }) {
    const res = await api.post("/api/comments", data);
    return res.data;
  },
};

export default api;
