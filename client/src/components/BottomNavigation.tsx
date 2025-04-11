import { useLocation } from "wouter";
import { useState } from "react";

interface BottomNavigationProps {
  activePage: "home" | "matching" | "messages" | "profile";
}

export default function BottomNavigation({ activePage }: BottomNavigationProps) {
  const [_, setLocation] = useLocation();
  const [showChambazo, setShowChambazo] = useState(false);
  
  const toggleChambazo = () => {
    setShowChambazo(!showChambazo);
  };
  
  return (
    <div className="relative">
      {/* Chambazo Popup */}
      {showChambazo && (
        <div className="absolute bottom-full left-0 right-0 mb-4 p-4 bg-white rounded-t-2xl shadow-lg border border-gray-200 animate-in slide-in-from-bottom duration-300 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#8A4EFC]">¡CHAMBAZO!</h3>
            <button 
              onClick={toggleChambazo}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button 
              className="flex flex-col items-center justify-center p-4 bg-[#8A4EFC]/10 rounded-xl hover:bg-[#8A4EFC]/20 transition-colors"
              onClick={() => setLocation("/matching")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8A4EFC] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <circle cx="12" cy="10" r="2"></circle>
                <line x1="8" x2="8" y1="2" y2="4"></line>
                <line x1="16" x2="16" y1="2" y2="4"></line>
              </svg>
              <span className="text-sm font-medium text-gray-700">Buscar Estudiantes</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center p-4 bg-[#8A4EFC]/10 rounded-xl hover:bg-[#8A4EFC]/20 transition-colors"
              onClick={() => setLocation("/matching")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8A4EFC] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
              <span className="text-sm font-medium text-gray-700">Buscar Empresas</span>
            </button>
          </div>
          
          <button 
            className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg flex items-center justify-center shadow-md hover:bg-yellow-600 transition-colors"
            onClick={() => {
              setShowChambazo(false);
              setLocation("/matching");
            }}
          >
            <span className="mr-2">¡DAME UN CHAMBAZO!</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 8 4 1 1 4"></path>
              <path d="m7 13 3 3 8-8"></path>
              <path d="m13 12 4-1 1-4"></path>
            </svg>
          </button>
        </div>
      )}
      
      {/* Bottom Navigation Bar */}
      <div className="border-t border-slate-200 flex justify-around items-center py-3 px-2 bg-white relative z-0">
        <button 
          className={`flex flex-col items-center justify-center w-16 ${activePage === "home" ? "text-[#8A4EFC]" : "text-slate-500"}`}
          onClick={() => setLocation("/home")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs mt-1">Inicio</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-16 ${activePage === "matching" ? "text-[#8A4EFC]" : "text-slate-500"}`}
          onClick={() => setLocation("/matching")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span className="text-xs mt-1">Buscar</span>
        </button>
        
        {/* CHAMBAZO Button */}
        <button 
          className="flex flex-col items-center justify-center w-16 relative -mt-6"
          onClick={toggleChambazo}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span className="text-xs mt-1 font-bold text-yellow-500">CHAMBAZO</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-16 ${activePage === "messages" ? "text-[#8A4EFC]" : "text-slate-500"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
          </svg>
          <span className="text-xs mt-1">Mensajes</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-16 ${activePage === "profile" ? "text-[#8A4EFC]" : "text-slate-500"}`}
          onClick={() => setLocation("/profile")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
          </svg>
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}
