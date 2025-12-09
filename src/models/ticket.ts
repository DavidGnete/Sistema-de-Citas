import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "newuser", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "newuser" },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // <-- Esto actualiza createdAt y updatedAt automáticamente
);

export const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
