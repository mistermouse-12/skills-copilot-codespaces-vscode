import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";  // Importa CORS
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Habilitar CORS para todas las solicitudes, puedes configurarlo más específicamente si es necesario
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esta URL si tu frontend está en otro puerto o dominio
  methods: 'GET,POST',  // Puedes ajustar los métodos permitidos si es necesario
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para logueo de las solicitudes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Registra tus rutas de la API
(async () => {
  const server = await registerRoutes(app);

  // Manejo de errores global
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Configura Vite solo en desarrollo
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Servir el backend y el frontend en el mismo puerto
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
