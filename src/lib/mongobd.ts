import mongoose from "mongoose";

const MONGO_URI= process.env.MONGO_URI as string;
    

/* validacion si esta bien copiado */
if (!MONGO_URI) {
    throw new Error("Define bien la dirrecion del mongoDB");
}

export async function connectToDatabase() {  /* esta me ayudara a evitar tener muchas o multiples conexiones a mongoDB */
    try {
        if (mongoose.connection.readyState >= 1) {  /* esto me dice si mongoDB ya esta conectado no volvera a hacerlo */
            console.log("mongoDB ya esta conectado ", mongoose.connection.readyState);
            return;
        }

        await mongoose.connect(MONGO_URI, {serverSelectionTimeoutMS: 5000} as any); /* esta parte es por si no esta conectado esto lo vuelve a conectar devolviendo un 500 */
        console.log("conectado a mongoDB");
    } catch (error) {
        console.log("no se pudo conectar a el mongoDB", error);
        throw error;
    }
}