import mongoose, {Document, Model} from "mongoose";

export interface IUser extends Document {  /* parte necesaria para typescript */
    name: string;
    email: string;
    cc: number;
    password: string;
    createdAt:Date;
    role: "client" | "agent";
}

const UserSchema = new mongoose.Schema<IUser>({  /* aqui se define el esquema de la base de datos */
    name:{ type: String, required: true, trim: true },
    email:{ type: String, required: true, unique: true, trim: true },
    cc: { type: Number, required: true, unique: true },
    password:{ type: String, required: true, trim: true },
    role: { type: String, enum: ["client","agent"], default: "client" },
    createdAt: { type: Date, default: Date.now },
});

export const newuser: Model<IUser> = mongoose.models.newuser || mongoose.model<IUser>("newuser", UserSchema);