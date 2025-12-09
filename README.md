# 🎫 Sistema de Soporte y Gestión de Tickets

Una aplicación web moderna para gestionar tickets de soporte  con flujos separados para clientes y agentes. Construida con **Next.js 16**, **TypeScript**, **MongoDB**, **NextAuth** y **Tailwind CSS**.

---

## 📋 Descripción General del Sistema

### Características Principales

- **Panel de Clientes**: Crear tickets, ver historial, recibir actualizaciones vía comentarios.
- **Panel de Agentes**: Listar, filtrar y gestionar tickets (cambiar estado, prioridad, asignar).
- **Comentarios en Tiempo Real**: Comunicación entre cliente y agente.
- **Correos Automáticos**: Notificación enviada cuando se crea un nuevo ticket.
- **Base de Datos MongoDB**: Persistencia con Mongoose.
- **Interfaz Responsiva**: Diseño con Tailwind CSS.

---

## 🔧 Requisitos Previos

### Tecnologías y Versiones

- **npm**: gestor de paquetes
- **MongoDB**: base de datos (local o Atlas en la nube)
- **Git**: para clonar el repositorio



##  Flujo Principal de la Aplicación

### 1️⃣ Autenticación (Login/Registro)

- El usuario accede a `/login` o `/register`.
- Puede registrarse con email/contraseña
- Credenciales se almacenan en MongoDB (contraseñas hasheadas con bcryptjs).

### 2️⃣ Panel del Cliente - Crear Ticket

```
Cliente inicia sesión → Panel Cliente → Nuevo Ticket
  ├─ Ingresa: Título, Descripción, Prioridad
  ├─ Sistema guarda ticket en MongoDB
  ├─ Automáticamente envía correo al cliente
  └─ Redirige a vista del ticket creado
```

**Campos del Ticket:**
- Título (requerido)
- Descripción (requerido)
- Prioridad: Baja, Media, Alta (default: Media)
- Estado: Abierto → En Progreso → Resuelto → Cerrado

### 3️⃣ Panel del Cliente - Ver y Comentar

```
Cliente → Mis Tickets → Selecciona un ticket
  ├─ Ve: Título, Descripción, Estado, Prioridad, Quién está asignado
  ├─ Ve comentarios del agente
  └─ Puede escribir comentarios
```

### 4️⃣ Panel del Agente - Gestionar Tickets

```
Agente inicia sesión → Panel Agente → Lista de Tickets
  ├─ Filtra por estado o prioridad
  ├─ Selecciona un ticket
  ├─ Ve quién lo creó (cliente) con nombre y email
  ├─ Puede:
  │  ├─ Cambiar estado (Abierto → En Progreso → Resuelto → Cerrado)
  │  ├─ Cambiar prioridad (Baja ↔ Media ↔ Alta)
  │  ├─ Asignar a otro agente (si es administrador)
  │  └─ Comentar para comunicarse con el cliente
  └─ Los cambios se guardan inmediatamente
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx                    # Layout principal
│   ├── page.tsx                      # Home
│   ├── globals.css                   # Estilos globales
│   ├── api/                          # Endpoints backend
│   │   ├── auth/[...nextauth]/       # Autenticación NextAuth
│   │   ├── register/                 # Registro de usuarios
│   │   ├── tickets/                  # Crud de tickets
│   │   └── comments/                 # Crud de comentarios
│   └── (Dashboard)/                  # Rutas protegidas
│       ├── agent/                    # Panel agentes
│       └── client/                   # Panel clientes
├── models/                           # Esquemas Mongoose
│   ├── register.ts                   # Modelo usuario
│   ├── ticket.ts                     # Modelo ticket
│   └── comment.ts                    # Modelo comentario
├── lib/
│   ├── mongobd.ts                    # Conexión MongoDB
│   ├── mailer.ts                     # Envío de correos
│   └── emailTemplates/               # Plantillas HTML
├── components/                       # Componentes React
│   ├── ui/                           # Componentes UI reutilizables
│   ├── tickets/                      # Componentes de tickets
│   └── comments/                     # Componentes de comentarios
├── services/                         # Cliente API (axios)
└── types/                            # Tipos TypeScript
```

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/register` - Registro

### Tickets
- `GET /api/tickets` - Listar tickets (con filtros: `status`, `priority`, `userId`)
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets/[id]` - Obtener ticket por ID
- `PUT /api/tickets/[id]` - Actualizar ticket (status, priority, assignedTo)

### Comentarios
- `GET /api/comments/[ticketId]` - Obtener comentarios de un ticket
- `POST /api/comments` - Crear comentario

---

## 🎨 Componentes Principales

### Cliente
- **ClientDashboard**: Vista general con estadísticas.
- **TicketsList**: Lista de tickets con filtros.
- **ClientTicketView**: Detalle del ticket y comentarios.
- **CommentsClient**: Interfaz para leer y escribir comentarios.

### Agente
- **AgentDashboard**: Panel con tareas pendientes.
- **TicketsList**: Lista de todos los tickets.
- **TicketDetailsClient**: Vista editable (cambiar estado, prioridad, asignar).
- **CommentsClient**: Comentarios del ticket.

---

## 📧 Correos Automáticos

Cuando un cliente crea un ticket, se envía automáticamente un correo con:
- Título del ticket
- Descripción
- Prioridad
- Estado inicial
- ID del ticket
- Fecha de creación



## 🔐 Roles y Permisos

- **Cliente**: Puede crear tickets propios, ver comentarios, comentar.
- **Agente**: Puede ver todos los tickets, cambiar estado/prioridad, asignar, comentar.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 16.0.8 | Framework React |
| TypeScript | 5 | Tipado estático |
| MongoDB | - | Base de datos NoSQL |
| Mongoose | 9.0.1 | ODM para MongoDB |
| NextAuth | 4.24.13 | Autenticación |
| Tailwind CSS | 4 | Estilos CSS |
| Axios | 1.13.2 | Cliente HTTP |
| Nodemailer | 6.9.4 | Envío de correos |
| React Toastify | 11.0.5 | Notificaciones |

---

## 📝 Datos del Desarrollador

| Campo | Valor |
|-------|-------|
| **Nombre** | David Agudelo Ocampo |
| **Clan** | Gosling |
| **Correo** | agudeloocampodavid@gmail.com |
| **Documento de Identidad** | 1.001.479.578|

---






**Última actualización:** 9 de diciembre de 2025
