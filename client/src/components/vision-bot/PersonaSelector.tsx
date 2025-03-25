import { useState, useEffect, useRef } from 'react';
import { usePersona } from '../../contexts/PersonaContext';
import { artCriticPersonas, Persona, ArtExpertiseArea } from '../../lib/personas';
import { ChevronUp, User } from 'lucide-react';

interface PersonaSelectorProps {
  compact?: boolean; // For smaller UI in mobile view
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
    <div 
      ref={containerRef}
      className={`fixed z-10 ${compact ? 'top-20' : 'top-4'} right-4`}
    >
      {/* Dropdown selector - positioned ABOVE the button */}
      {isExpanded && (
        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-black/80 backdrop-blur-md rounded-lg shadow-lg text-white">
          <h3 className="text-xs font-medium mb-2 text-gray-300">Select Art Critic</h3>
          
          <div className="space-y-2 max-h-[40vh] overflow-y-auto">
            {artCriticPersonas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handleSelectPersona(persona)}
                className={`w-full flex items-start text-left p-2 rounded hover:bg-white/10 transition-colors ${
                  currentPersona.id === persona.id ? 'bg-white/10' : ''
                }`}
              >
                <div 
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mr-2" 
                  style={{ backgroundColor: persona.avatarColor }}
                >
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{persona.name}</h4>
                    <span className="text-xs text-gray-300">{getAreaLabel(persona.area)}</span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 mt-0.5">
                    {persona.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Current persona button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full pl-2 pr-3 py-1 text-white shadow-lg hover:bg-black/80 transition-colors duration-150"
        aria-label={getButtonAriaLabel()}
        aria-expanded={isExpanded}
      >
        <div 
          className="w-5 h-5 rounded-full flex items-center justify-center" 
          style={{ backgroundColor: currentPersona.avatarColor }}
        >
          <User className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-xs font-medium">{currentPersona.name}</span>
        <ChevronUp
          className={`w-3 h-3 transition-transform duration-150 ${isExpanded ? '' : 'rotate-180'}`} 
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