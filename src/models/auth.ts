import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongobd";
import { newuser } from "@/models/register"; 

//archivo imortante que permite que next-auth pueda validar los usuarios logeados o no para una transacion futura

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }

        await connectToDatabase();

        const user = await newuser.findOne({ email: credentials.email });

        if (!user) throw new Error("Usuario no encontrado");

        const isCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isCorrect) throw new Error("Contraseña incorrecta");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: (user as any).role || "user",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role || "user";
      }
      return session;
    },
  },
};
