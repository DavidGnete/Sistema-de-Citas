import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  ticketId: Types.ObjectId;   // Ticket al que pertenece
  author: Types.ObjectId;     // User que comenta (client o agent)
  message: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "newuser",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
    // Solo createdAt (los comentarios NO se editan)
  }
);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
