'use client'
// Layout raíz que proporciona la sesión a toda la aplicación
// SessionProvider envuelve todo el contenido para que los componentes
// puedan acceder a la sesión del usuario con useSession()

import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Envuelvo el contenido con SessionProvider para dar acceso a la sesión */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
