import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useIsMobile } from "@/hooks/use-mobile";

// Esquema de validación para login
const loginSchema = z.object({
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

// Esquema de validación para registro
const registerSchema = z.object({
  fullName: z.string().min(3, "Nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
  userType: z.enum(["student", "business"])
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Tipos para los formularios
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("login");

  // Redireccionar si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      setLocation("/home");
    }
  }, [user, setLocation]);

  // Formulario de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Formulario de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      userType: "student",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password
      });
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: "Bienvenido a CHAMBEA YA",
      });
      setLocation("/home");
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
        userType: data.userType,
        profilePic: null, // Valor por defecto, puede ser null
      });
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada con éxito",
      });
      setLocation("/home");
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error al crear tu cuenta",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between shadow-sm">
        <Logo size={isMobile ? "sm" : "md"} />
        <button
          onClick={goBack}
          className="text-gray-600 hover:text-[#8A4EFC]"
        >
          Volver
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Lado izquierdo - Formulario */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a CHAMBEA YA</h1>
              <p className="text-gray-600">¡La mejor plataforma para conectar estudiantes y empresas!</p>
            </div>

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-base py-3">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="text-base py-3">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Usuario</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tu nombre de usuario" 
                              {...field}
                              className="py-6 px-4" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Tu contraseña" 
                              {...field}
                              className="py-6 px-4" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-bold bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nombre completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tu nombre completo" 
                              {...field}
                              className="py-6 px-4" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Correo electrónico</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tu@correo.com" 
                              {...field}
                              className="py-6 px-4" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nombre de usuario</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tu nombre de usuario" 
                              {...field}
                              className="py-6 px-4" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Tu contraseña" 
                                {...field}
                                className="py-6 px-4" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Confirmar contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirma tu contraseña" 
                                {...field}
                                className="py-6 px-4" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tipo de usuario</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Button
                              type="button"
                              variant={field.value === "student" ? "default" : "outline"}
                              className={field.value === "student" ? "bg-[#8A4EFC] hover:bg-[#7A3EEC]" : "border-[#8A4EFC] text-[#8A4EFC]"}
                              onClick={() => field.onChange("student")}
                            >
                              Estudiante
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "business" ? "default" : "outline"}
                              className={field.value === "business" ? "bg-[#8A4EFC] hover:bg-[#7A3EEC]" : "border-[#8A4EFC] text-[#8A4EFC]"}
                              onClick={() => field.onChange("business")}
                            >
                              Empresa
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-bold bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creando cuenta..." : "CREAR CUENTA"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Lado derecho - Ilustración (solo en desktop) */}
          {!isMobile && (
            <div className="flex flex-col justify-center items-center">
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-10">
                  <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¡CHAMBEA YA!</h2>
                    <p className="text-lg text-gray-600">
                      {activeTab === "login" ? 
                        "Inicia sesión para conectar con las mejores oportunidades" : 
                        "Regístrate ahora y comienza a construir tu futuro"
                      }
                    </p>
                  </div>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="400">
                    <circle cx="250" cy="200" r="150" fill="#8A4EFC" fillOpacity="0.1" />
                    
                    {/* Elementos decorativos */}
                    <circle cx="150" cy="100" r="30" fill="#FFB800" fillOpacity="0.2" className="animate-pulse" />
                    <circle cx="350" cy="300" r="40" fill="#8A4EFC" fillOpacity="0.2" className="animate-pulse" style={{animationDuration: '3s'}} />
                    <circle cx="400" cy="150" r="25" fill="#6D28D9" fillOpacity="0.2" className="animate-pulse" style={{animationDuration: '4s'}} />
                    
                    {/* Persona 1 - Estudiante */}
                    <g transform="translate(150, 150)">
                      <g className="animate-bounce" style={{animationDuration: '3s'}}>
                        <circle cx="0" cy="0" r="40" fill="#8A4EFC" />
                        <rect x="-20" y="45" width="40" height="80" rx="15" fill="#8A4EFC" />
                        <rect x="-40" y="60" width="80" height="20" rx="10" fill="#8A4EFC" fillOpacity="0.8" />
                        <rect x="-20" y="130" width="20" height="50" rx="10" fill="#8A4EFC" />
                        <rect x="0" y="130" width="20" height="50" rx="10" fill="#8A4EFC" />
                        
                        {/* Bombilla de idea */}
                        <circle cx="-60" cy="-40" r="25" fill="#FFB800" fillOpacity="0.9" className="animate-pulse" />
                        <path d="M-60 -20 L-60 -10" stroke="#FFB800" strokeWidth="3" />
                        <path d="M-45 -55 L-35 -65" stroke="#FFB800" strokeWidth="3" />
                        <path d="M-75 -55 L-85 -65" stroke="#FFB800" strokeWidth="3" />
                      </g>
                    </g>
                    
                    {/* Persona 2 - Empresa */}
                    <g transform="translate(300, 180)">
                      <g className="animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
                        <circle cx="0" cy="0" r="40" fill="#6D28D9" />
                        <rect x="-20" y="45" width="40" height="80" rx="15" fill="#6D28D9" />
                        <rect x="-40" y="60" width="80" height="20" rx="10" fill="#6D28D9" fillOpacity="0.8" />
                        <rect x="-20" y="130" width="20" height="50" rx="10" fill="#6D28D9" />
                        <rect x="0" y="130" width="20" height="50" rx="10" fill="#6D28D9" />
                        
                        {/* Maletín de empresa */}
                        <rect x="40" y="60" width="50" height="40" rx="5" fill="#6D28D9" fillOpacity="0.8" />
                        <rect x="55" y="50" width="20" height="10" rx="3" fill="#6D28D9" fillOpacity="0.8" />
                      </g>
                    </g>
                    
                    {/* Conexión entre personas - Rayos estilo "CHAMBAZO" */}
                    <path d="M210 160 L240 160 L230 200 L260 200" stroke="#FFB800" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                    
                    {/* "CHAMBEA YA" efecto */}
                    <g transform="translate(200, 80)">
                      <rect x="0" y="0" width="100" height="30" rx="15" fill="#FFB800" className="animate-pulse" />
                      <text x="50" y="20" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">CHAMBEA YA</text>
                    </g>
                  </svg>
                  
                  <div className="mt-8 bg-[#8A4EFC]/10 p-6 rounded-lg">
                    <h3 className="font-bold text-[#8A4EFC] mb-2">
                      {activeTab === "login" ? "¿Por qué iniciar sesión?" : "¿Por qué registrarse?"}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8A4EFC] mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {activeTab === "login" ? 
                          "Accede a tu perfil y todas tus conexiones" : 
                          "Crea tu perfil personalizado"
                        }
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8A4EFC] mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {activeTab === "login" ? 
                          "Descubre nuevas oportunidades basadas en tu perfil" : 
                          "Conecta con las mejores oportunidades"
                        }
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8A4EFC] mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {activeTab === "login" ? 
                          "Continuá tu camino profesional" : 
                          "Empieza a recibir chambazos de inmediato"
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="py-4 px-6 text-center text-gray-500 border-t border-gray-100 bg-white">
        <p>© 2023 CHAMBEA YA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}