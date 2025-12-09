// Paso 1: leer la URI de conexión desde las variables de entorno.
// Paso 2: si falta la URI, lanzar un error claro para que lo arreglen.
// Función: conectar con MongoDB y evitar abrir más de una conexión.
import mongoose from "mongoose";

// Paso: obtener la URI de conexión.
const MONGO_URI = process.env.MONGO_URI as string;

/* validacion si esta bien copiado */
// Paso: si no hay URI, detener la ejecución con un error claro.
if (!MONGO_URI) {
    throw new Error("Define bien la dirrecion del mongoDB");
}

// Función: conecta a MongoDB y evita reconectar si ya hay una conexión activa.
export async function connectToDatabase() {
    try {
        // Paso: si ya hay conexión, salir sin reconectar.
        if (mongoose.connection.readyState >= 1) {
            console.log("mongoDB ya esta conectado ", mongoose.connection.readyState);
            return;
        }

        // Paso: intentar conectar con un timeout razonable.
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 } as any);
        console.log("conectado a mongoDB");
    } catch (error) {
        // Paso: si falla la conexión, mostrar el error y relanzarlo.
        console.log("no se pudo conectar a el mongoDB", error);
        throw error;
    }
}