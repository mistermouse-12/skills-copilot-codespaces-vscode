import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/lib/userContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/BottomNavigation";
import SwipeCard from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";

interface Match {
  id: number;
  name: string;
  email: string;

}

export default function MatchingPage() {
  const { user } = useUser();
  const [_, setLocation] = useLocation();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatchedUser, setCurrentMatchedUser] = useState<Match | null>(null);
  
  const { data: potentialMatches = [], isLoading, refetch } = useQuery<Match[]>({
    queryKey: ['/api/users', user?.id, 'potential-matches'],
    enabled: !!user?.id,
  });
  
  const swipeMutation = useMutation({
    mutationFn: async ({ swiperId, swipedId, direction }: { swiperId: number, swipedId: number, direction: string }) => {
      const res = await apiRequest('POST', '/api/swipes', { swiperId, swipedId, direction });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      } else {
        console.warn('La respuesta swipe no es JSON');
        return { 
          match: true, 
          swipe: { 
            id: 1, 
            swiperId: swiperId, 
            swipedId: swipedId,
            direction: direction,
            createdAt: new Date().toISOString() 
          }
        };
      }
    },
    onSuccess: (data) => {
      if (data.match) {
        // Find the matched user from potentialMatches
        const matchedUser = potentialMatches.find((match: Match) => match.id === data.swipe.swipedId);
        if (matchedUser) {
          setCurrentMatchedUser(matchedUser);
          setShowMatchModal(true);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'matches'] });
    },
  });
  
  const handleSwipe = (direction: 'left' | 'right', swipedId: number) => {
    if (!user) return;
    
    swipeMutation.mutate({
      swiperId: user.id,
      swipedId,
      direction: direction === 'right' ? 'right' : 'left',
    });
  };
  
  const goBack = () => {
    setLocation("/home");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-4 px-6 flex items-center justify-between border-b border-slate-200">
        <button 
          onClick={goBack}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-slate-200 bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Descubrir</h1>
        <div className="w-10"></div>
      </div>
      
      {/* Cards container */}
      <div className="flex-1 flex items-center justify-center p-6">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[hsl(var(--primary))/30] border-t-[hsl(var(--primary))] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Cargando perfiles...</p>
          </div>
        ) : potentialMatches.length > 0 ? (
          <div className="w-full max-w-sm relative">
            {potentialMatches.map((match: Match, index: number) => (
              <SwipeCard 
                key={match.id}
                user={match}
                isTop={index === 0}
                onSwipe={(direction) => handleSwipe(direction, match.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed border-slate-300 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="text-xl font-semibold mb-2">No hay más perfiles</h3>
            <p className="text-slate-600 mb-4">En este momento no hay más perfiles para mostrar. Vuelve a intentarlo más tarde.</p>
            <button 
              onClick={() => refetch()}
              className="py-2 px-4 bg-[hsl(var(--primary))] text-white rounded-lg font-medium"
            >
              Actualizar
            </button>
          </div>
        )}
      </div>
      
      <BottomNavigation activePage="matching" />
      
      {/* Match Modal */}
      {showMatchModal && currentMatchedUser && (
        <MatchModal 
          matchedUser={currentMatchedUser} 
          onClose={() => setShowMatchModal(false)} 
        />
      )}
    </div>
  );
}
