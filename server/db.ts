import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración de WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Verificación de la variable de entorno DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Crear el pool de conexiones
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Configuración de Drizzle ORM con el cliente y el esquema
export const db = drizzle({ client: pool, schema });

// Verificación de la conexión a la base de datos
pool.connect()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);  // Salir del proceso si no se puede conectar
  });
