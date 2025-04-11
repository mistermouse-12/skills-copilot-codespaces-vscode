import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";
import { 
  StudentIllustration, 
  BusinessIllustration, 
  MatchIllustration,
  DynamicBackgroundSVG
} from "@/components/IllustrationSVG";
import { 
  Sparkles, 
  Rocket, 
  Zap, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle2,
  ArrowRight,
  Star,
  LucideIcon,
  Briefcase,
  GraduationCap
} from "lucide-react";

// Tipos para componentes recurrentes
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

// Variantes de animación
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      delay: 0.05 * i,
      ease: [0.215, 0.61, 0.355, 1] 
    } 
  }),
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const floatingAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation: Variants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Componente FeatureCard
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color, index }) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-lg p-6 bg-white border border-gray-100 group"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      custom={index}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <motion.div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: color }}
        variants={pulseAnimation}
      />
        
      <div className="relative">
        <motion.div
          className="w-16 h-16 mb-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{ scale: 1.1, backgroundColor: `${color}30` }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon size={26} color={color} />
        </motion.div>
        
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <motion.div 
          className="text-sm font-semibold flex items-center gap-1 mt-2" 
          style={{ color }}
          whileHover={{ x: 5 }}
        >
          <span>Saber más</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [_, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  
  const handleGetStarted = () => {
    setLocation("/explanation");
  };

  const handleLogin = () => {
    setLocation("/auth");
  };

  const handleSignup = () => {
    setLocation("/signup");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const features = [
    {
      icon: GraduationCap,
      title: "Ideal para Estudiantes",
      description: "Gana experiencia laboral real mientras aplicas tus conocimientos académicos en proyectos de impacto",
      color: "#8A4EFC"
    },
    {
      icon: Briefcase,
      title: "Impulsa tu MYPE",
      description: "Conecta con talento joven y fresco para desarrollar proyectos innovadores a costos accesibles",
      color: "#FF6B6B"
    },
    {
      icon: Zap,
      title: "Encuentra el match perfecto",
      description: "Nuestro algoritmo de emparejamiento conecta habilidades e intereses para una colaboración óptima",
      color: "#FFB800"
    },
    {
      icon: Rocket,
      title: "Plataforma sin complicaciones",
      description: "Interfaz intuitiva con sistema de matching similar a las apps más populares",
      color: "#BA45F0"
    },
    {
      icon: Users,
      title: "Crea tu red profesional",
      description: "Amplía tu red de contactos profesionales con empresas y otros estudiantes",
      color: "#36D399"
    },
    {
      icon: Award,
      title: "Proyectos reales",
      description: "Todas las oportunidades son para proyectos reales que enriquecerán tu portafolio",
      color: "#26C0E6"
    }
  ];

  const testimonials = [
    {
      name: "Mariana López",
      role: "Estudiante de Ingeniería",
      quote: "Gracias a CHAMBEA YA conseguí mi primera experiencia laboral en una startup que valora mis ideas.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      stars: 5
    },
    {
      name: "Roberto Gómez",
      role: "Propietario MyPE",
      quote: "Conectamos con estudiantes de marketing digital que transformaron nuestra presencia online.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      stars: 5
    },
    {
      name: "Daniela Ruiz",
      role: "Estudiante de Diseño",
      quote: "Encontré clientes reales para mi portafolio y aprendí sobre negocios en el proceso.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      stars: 4
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white">
      {/* Fondo dinámico */}
      <div className="fixed inset-0 -z-10">
        <DynamicBackgroundSVG className="w-full h-full" />
      </div>
      
      {/* Header */}
      <motion.header 
        className="sticky top-0 backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 px-6 flex justify-between items-center shadow-sm z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Logo size="md" />
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-6">
          <motion.a 
            href="#features" 
            className="text-gray-600 font-medium hover:text-[#8A4EFC] transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Funcionalidades
          </motion.a>
          <motion.a 
            href="#how-it-works" 
            className="text-gray-600 font-medium hover:text-[#8A4EFC] transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Cómo Funciona
          </motion.a>
          <motion.button
            onClick={handleLogin}
            className="text-gray-600 font-medium hover:text-[#8A4EFC] transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Iniciar Sesión
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSignup}
              className="bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] hover:opacity-90 transition-opacity text-white font-medium"
            >
              Registrarse
            </Button>
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <motion.button 
            onClick={toggleMenu}
            className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
          >
            <motion.span 
              className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}
              animate={menuOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: 0 }}
            />
            <motion.span 
              className={`w-5 h-0.5 bg-gray-600 transition-all duration-300`}
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span 
              className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}
              animate={menuOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="absolute top-full right-0 w-full bg-white shadow-xl rounded-b-xl z-40 overflow-hidden md:hidden border-t border-gray-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-4 px-6 flex flex-col space-y-4">
                <a href="#features" className="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700">
                  Funcionalidades
                </a>
                <a href="#how-it-works" className="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700">
                  Cómo Funciona
                </a>
                <hr className="border-gray-100" />
                <button 
                  onClick={handleLogin}
                  className="py-3 px-4 rounded-lg text-left hover:bg-gray-50 text-gray-700"
                >
                  Iniciar Sesión
                </button>
                <Button 
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] hover:opacity-90 text-white font-medium"
                >
                  Registrarse
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Hero section */}
      <section className="relative pt-16 md:pt-24 pb-20 overflow-hidden px-6">
        {/* Elementos decorativos */}
        <motion.div 
          className="absolute top-20 right-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-[#8A4EFC]/10 to-[#BA45F0]/5 blur-xl"
          variants={pulseAnimation}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-10 left-[5%] w-60 h-60 rounded-full bg-gradient-to-tr from-[#FF6B6B]/10 to-[#FFB800]/5 blur-xl"
          variants={pulseAnimation}
          initial="initial"
          animate="animate"
          custom={1}
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
                variants={{
                  initial: { opacity: 0 },
                  animate: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                <motion.span 
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0]"
                  variants={{ 
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                >
                  Encuentra tu
                </motion.span>
                <motion.span 
                  className="block"
                  variants={{ 
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
                  }}
                >
                  chamba ideal
                </motion.span>
                <motion.div
                  className="inline-flex items-center"
                  variants={{ 
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.4 } }
                  }}
                >
                  <motion.span 
                    className="ml-2 text-yellow-500 inline-flex items-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ¡YA! <Sparkles className="ml-1 h-8 w-8 text-yellow-500" />
                  </motion.span>
                </motion.div>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                La plataforma que conecta estudiantes con pequeñas empresas a través
                de un sistema de matching intuitivo. Encuentra oportunidades que se adaptan
                perfectamente a tus habilidades e intereses con un simple desliz.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 sm:items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleGetStarted}
                    size="lg" 
                    className="bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] hover:opacity-90 text-white text-lg font-bold py-6 px-8 rounded-xl shadow-lg"
                  >
                    <motion.span 
                      className="flex items-center gap-2"
                      animate={{ 
                        x: [0, 5, 0],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut" 
                      }}
                    >
                      ¡EMPEZAR AHORA! <Zap size={20} />
                    </motion.span>
                  </Button>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-0">
                  <motion.button 
                    onClick={handleLogin}
                    className="text-[#8A4EFC] font-semibold hover:underline flex items-center justify-center sm:justify-start"
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Ya tengo una cuenta
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex gap-6 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#8A4EFC]" />
                  <span className="text-sm">Sin costo para estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#8A4EFC]" />
                  <span className="text-sm">100% match garantizado</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative lg:ml-10 z-10">
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <div className="p-8 bg-gradient-to-br from-white to-purple-50">
                    <div className="flex justify-between mb-10">
                      <motion.div
                        className="flex-1"
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                      >
                        <StudentIllustration className="w-full h-auto" />
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-center w-24"
                        animate={{ 
                          rotate: [0, 360],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] opacity-10" />
                        <Zap className="absolute text-[#FFB800] w-8 h-8" />
                      </motion.div>
                      
                      <motion.div
                        className="flex-1"
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                        custom={1.5}
                      >
                        <BusinessIllustration className="w-full h-auto" />
                      </motion.div>
                    </div>
                    
                    <div className="relative">
                      <motion.div
                        className="w-40 h-40 mx-auto"
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                        custom={1}
                      >
                        <MatchIllustration className="w-full h-auto" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-3 px-5 bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] text-white font-bold rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.8, delay: 1, times: [0, 0.7, 1] }}
                      >
                        ¡CHAMBAZO!
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] p-6 flex justify-between items-center">
                    <motion.p 
                      className="text-white font-bold text-lg"
                      animate={{ 
                        y: [0, -3, 0],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      ¡El match perfecto!
                    </motion.p>
                    
                    <motion.div 
                      className="flex gap-1"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="py-16 relative px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100"
              variants={fadeInUp}
              custom={1}
            >
              <motion.h3 
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0]"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                1,500+
              </motion.h3>
              <motion.p className="text-gray-600 text-lg">Estudiantes activos</motion.p>
            </motion.div>
            
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100"
              variants={fadeInUp}
              custom={2}
            >
              <motion.h3 
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#BA45F0] to-[#FF6B6B]"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >
                350+
              </motion.h3>
              <motion.p className="text-gray-600 text-lg">MYPEs registradas</motion.p>
            </motion.div>
            
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100"
              variants={fadeInUp}
              custom={3}
            >
              <motion.h3 
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#FFB800] to-[#FF6B6B]"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              >
                98%
              </motion.h3>
              <motion.p className="text-gray-600 text-lg">Tasa de satisfacción</motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Funcionalidades */}
      <section id="features" className="py-20 relative px-6">
        <motion.div 
          className="absolute top-40 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#8A4EFC]/10 to-[#BA45F0]/5 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0]">
                Funcionalidades
              </span> que te encantarán
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Una plataforma diseñada para facilitar conexiones significativas entre estudiantes
              y pequeñas empresas
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Cómo funciona */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <motion.div 
          className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FFB800]/10 to-[#FF6B6B]/5 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB800] to-[#FF6B6B]">
                Cómo funciona
              </span> CHAMBEA YA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Con solo unos pocos pasos, estarás en camino para encontrar
              tu conexión ideal
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] text-white text-2xl font-bold flex items-center justify-center mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Crea tu perfil</h3>
                <p className="text-gray-600">
                  Regístrate como estudiante o MYPE y completa tu perfil con tus habilidades,
                  intereses y experiencia. Cuanto más detallado, mejor será el match.
                </p>
              </div>
              <motion.div 
                className="hidden md:block absolute top-1/2 -right-5 transform translate-x-0 translate-y-1/2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-8 h-8 text-[#8A4EFC]" />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#BA45F0] to-[#FF6B6B] text-white text-2xl font-bold flex items-center justify-center mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Desliza y encuentra</h3>
                <p className="text-gray-600">
                  Explora perfiles de estudiantes o MYPEs, deslizando a la derecha para mostrar
                  interés o a la izquierda para pasar. Nuestro algoritmo te muestra los mejores matches.
                </p>
              </div>
              <motion.div 
                className="hidden md:block absolute top-1/2 -right-5 transform translate-x-0 translate-y-1/2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <ArrowRight className="w-8 h-8 text-[#BA45F0]" />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] text-white text-2xl font-bold flex items-center justify-center mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">¡Haz match y colabora!</h3>
                <p className="text-gray-600">
                  Cuando ambas partes muestran interés, ¡es un match! Comienza a chatear,
                  establece los términos de la colaboración y comienza un proyecto exitoso.
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] hover:opacity-90 text-white font-bold py-6 px-10 rounded-xl shadow-lg"
              >
                <motion.span 
                  className="flex items-center gap-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ¡Comienza ahora! <Rocket size={20} />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="py-20 px-6 relative bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0]">
                nuestros usuarios
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Historias reales de quienes ya han encontrado su match perfecto
            </p>
          </motion.div>
          
          <div className="relative h-[300px] md:h-[250px] overflow-hidden">
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                className="absolute inset-0 flex justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg max-w-2xl w-full">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <motion.img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-3">
                        {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg text-gray-600 italic mb-4">"{testimonials[currentIndex].quote}"</p>
                      <h4 className="font-bold text-lg">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-500">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-[#8A4EFC]' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-5xl mx-auto bg-gradient-to-br from-[#8A4EFC] to-[#BA45F0] rounded-3xl overflow-hidden shadow-xl relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white opacity-10"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="p-12 md:p-16 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ¿Listo para encontrar tu match perfecto?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              No pierdas más tiempo. Únete a CHAMBEA YA y comienza a conectar con 
              oportunidades que realmente importan.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-white text-[#8A4EFC] hover:bg-white/90 text-lg font-bold py-6 px-8 rounded-xl shadow-lg"
                >
                  <motion.span 
                    className="flex items-center gap-2"
                    animate={{ 
                      x: [0, 5, 0],
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut" 
                    }}
                  >
                    ¡CHAMBEA YA! <Zap size={20} />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Logo size="md" />
              <p className="text-gray-500">La plataforma que conecta estudiantes con pequeñas empresas de forma simple e intuitiva.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-500 hover:text-[#8A4EFC]">Funcionalidades</a></li>
                <li><a href="#how-it-works" className="text-gray-500 hover:text-[#8A4EFC]">Cómo Funciona</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Testimonios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Soporte</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Contactar</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#8A4EFC]">Trabaja con nosotros</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2023 CHAMBEA YA. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#8A4EFC]/10 hover:text-[#8A4EFC]" whileHover={{ y: -3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#8A4EFC]/10 hover:text-[#8A4EFC]" whileHover={{ y: -3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#8A4EFC]/10 hover:text-[#8A4EFC]" whileHover={{ y: -3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#8A4EFC]/10 hover:text-[#8A4EFC]" whileHover={{ y: -3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
