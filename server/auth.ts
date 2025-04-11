import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import createMemoryStore from "memorystore";
import dotenv from 'dotenv';
import cors from "cors";

// Cargar las variables del archivo .env
dotenv.config();

// Importar el tipo User de schema.ts
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      password: string;
      email: string;
      fullName: string;
      userType: string;
      profilePic?: string | null;
      createdAt: Date;
    }
  }
}

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

// Función para generar hash de la contraseña
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Función para comparar contraseñas hasheadas
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Configuración de autenticación
export function setupAuth(app: Express) {
  // Habilitar CORS para permitir acceso desde el frontend
  app.use(cors({
    origin: 'http://localhost:3000',  // Cambia esto si tu frontend está en otro dominio o puerto
    methods: 'GET,POST',  // Asegúrate de permitir los métodos adecuados
    credentials: true,  // Habilitar el envío de cookies de sesión
  }));

  // Configuración de sesiones
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "chambea-ya-secret-key", // Clave de sesión (puede ser personalizada)
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // Elimina entradas expiradas cada 24 horas
    }),
    cookie: {
      httpOnly: true,  // Asegura que las cookies solo puedan ser accedidas por el servidor
      secure: process.env.NODE_ENV === "production", // Usa cookies seguras solo en producción
      maxAge: 24 * 60 * 60 * 1000, // Duración de la cookie de sesión (24 horas)
    },
  };

  app.use(session(sessionSettings));  // Usar sesiones en la aplicación
  app.use(passport.initialize());  // Inicializar Passport
  app.use(passport.session());  // Usar sesiones con Passport

  // Configuración de la estrategia de autenticación local (usuario/contraseña)
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);  // Usuario no encontrado o contraseña incorrecta
        } else {
          return done(null, user);  // Usuario autenticado
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialización del usuario (guardar solo el ID del usuario en la sesión)
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialización del usuario (obtener el usuario completo a partir del ID)
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Ruta para registrar un nuevo usuario
  app.post("/api/register", async (req, res, next) => {
    try {
      // Verificar si el nombre de usuario ya existe
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
      }

      // Verificar si el correo electrónico ya está registrado
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "El correo electrónico ya está registrado" });
      }

      // Crear un nuevo usuario con la contraseña hasheada
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Auto-login después de registrar al usuario
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ message: "Usuario registrado exitosamente", user });
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  });

  // Ruta para iniciar sesión
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.status(200).json(user);  // Usuario autenticado con éxito
      });
    })(req, res, next);
  });

  // Ruta para cerrar sesión
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);  // Respuesta de éxito al cerrar sesión
    });
  });

  // Ruta para obtener el usuario autenticado
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);  // Devuelve los datos del usuario autenticado
  });
}
