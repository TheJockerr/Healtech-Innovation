# HealthTech Innovations – MVP

Plataforma de gestión de proyectos para HealthTech Innovations.  
Stack: **React + Vite** (frontend) · **Spring Boot 3** (backend) · **PostgreSQL** (base de datos) · **Docker Compose** (BD local)

---

## Requisitos previos

- [Java 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para levantar PostgreSQL)

---

## Levantar el proyecto

### 1. Base de datos (PostgreSQL con Docker)

```bash
docker compose up -d
```

Esto levanta PostgreSQL en `localhost:5432` con la base de datos `healthtech_db`.

### 2. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

API disponible en: `http://localhost:8080`

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en: `http://localhost:5173`

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión (retorna JWT) |
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/{id}` | Actualizar proyecto |
| PATCH | `/api/projects/{id}/estado` | Cambiar estado del proyecto |
| DELETE | `/api/projects/{id}` | Eliminar proyecto |
| GET | `/api/projects/{id}/tasks` | Tareas de un proyecto |
| POST | `/api/tasks` | Crear tarea |
| PATCH | `/api/tasks/{id}/estado` | Cambiar estado de tarea |
| GET | `/api/projects/{id}/resources` | Recursos de un proyecto |
| POST | `/api/resources` | Asignar recurso a proyecto |

> Todos los endpoints (excepto `/api/auth/**`) requieren `Authorization: Bearer <token>`

---

## Funcionalidades MVP

- Registro e inicio de sesión con JWT
- Gestión de proyectos (crear, listar, actualizar estado, eliminar)
- Gestión de tareas por proyecto (crear, cambiar estado, asignar a usuarios)
- Asignación de recursos/miembros a proyectos con carga de trabajo

---

## Arquitectura

```
React Vite :5173  →  Spring Boot :8080  →  PostgreSQL :5432
```

Sin AWS · Sin MongoDB · Sin RabbitMQ (innecesarios para el MVP)
