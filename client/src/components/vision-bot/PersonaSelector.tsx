import { useState, useEffect, useRef } from 'react';
import { usePersona } from '../../contexts/PersonaContext';
import { artCriticPersonas, Persona, ArtExpertiseArea } from '../../lib/personas';
import { ChevronUp, User } from 'lucide-react';

interface PersonaSelectorProps {
  compact?: boolean; // For smaller UI in mobile view - no longer used in new layout
}

export default function PersonaSelector({ compact = false }: PersonaSelectorProps) {
  const { currentPersona, setCurrentPersona } = usePersona();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle persona selection
  const handleSelectPersona = (persona: Persona) => {
    setCurrentPersona(persona);
    setIsExpanded(false);
  };
  
  // Get aria label for the selector button
  const getButtonAriaLabel = () => {
    return isExpanded ? 'Close art critic selector' : 'Open art critic selector';
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  return (
    <div ref={containerRef} className="relative">
      {/* Dropdown selector - positioned ABOVE the button */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-1 w-56 p-2 bg-black/90 backdrop-blur-md rounded-lg shadow-lg text-white">
          <h3 className="text-xs font-medium mb-1 text-gray-300">Select Art Critic</h3>
          
          <div className="space-y-1 max-h-[30vh] overflow-y-auto">
            {artCriticPersonas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handleSelectPersona(persona)}
                className={`w-full flex items-center text-left p-1 rounded hover:bg-white/10 transition-colors ${
                  currentPersona.id === persona.id ? 'bg-white/10' : ''
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mr-1" 
                  style={{ backgroundColor: persona.avatarColor }}
                >
                  <User className="h-2.5 w-2.5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-medium text-xs truncate">{persona.name}</h4>
                    <span className="ml-1 text-[10px] text-gray-300">({getAreaLabel(persona.area)})</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Current persona button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full pl-1.5 pr-2 py-0.5 text-white shadow-lg hover:bg-black/80 transition-colors duration-150"
        aria-label={getButtonAriaLabel()}
        aria-expanded={isExpanded}
      >
        <div 
          className="w-4 h-4 rounded-full flex items-center justify-center" 
          style={{ backgroundColor: currentPersona.avatarColor }}
        >
          <User className="h-2 w-2 text-white" />
        </div>
        <span className="text-[10px] font-medium">{currentPersona.name}</span>
        <ChevronUp
          className={`w-2.5 h-2.5 transition-transform duration-150 ${isExpanded ? '' : 'rotate-180'}`} 
        />
      </button>
    </div>
  );
}

// Helper function to get human-readable area labels
function getAreaLabel(area: ArtExpertiseArea): string {
  switch (area) {
    case 'technical': return 'Technique';
    case 'composition': return 'Structure';
    case 'color': return 'Color';
    case 'historical': return 'History';
    case 'conceptual': return 'Meaning';
    case 'general': return 'General';
    default: return area;
  }
}