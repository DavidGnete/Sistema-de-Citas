// Yo: este archivo recibe los datos cuando alguien se registra.
// Yo: valido los campos, encripto la contraseña y guardo el usuario.
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { newuser } from "@/models/register";
import { connectToDatabase } from "@/lib/mongobd";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) { 
    try {
        const body = await request.json();
        const { name, email, cc, password, role} = body;

        if(!name || !email || !cc || !password || !role) {
            return NextResponse.json({ error: "se olvidaron algunos requisitos" }, { status: 400 });
        }
    await connectToDatabase(); /* conecto a mi base de datos despues de recibir bien la infromacion y los campos marcados */

    const isexisting= await newuser.findOne({ email: email.toLowerCase() });
    if(isexisting) {
        return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);  /* genera una contraseña segura en base de datos */

    const user = new newuser({
        name,
        email: email.toLowerCase(),
        cc,
        password: hashedPassword,
        role: role.toLowerCase(),
    });
    await user.save();  /* guarda el usuario en la base de datos */

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
} catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
}
}