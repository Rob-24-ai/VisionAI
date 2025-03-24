'use client';

import { useState } from 'react';
import { artCriticPersonas, type Persona } from '@/lib/personas';
import { usePersona } from '@/contexts/PersonaContext';
import { Check, ChevronDown, UserCircle } from 'lucide-react';

interface PersonaSelectorProps {
  compact?: boolean; // For smaller UI in mobile view
}

export default function PersonaSelector({ compact = false }: PersonaSelectorProps) {
  const { currentPersona, setCurrentPersona } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectPersona = (persona: Persona) => {
    setCurrentPersona(persona);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      {/* Current persona button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full bg-dark-800/90 border border-white/10 backdrop-blur-md ${
          compact ? 'px-2 py-1' : 'px-3 py-2'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span 
          className="rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ 
            backgroundColor: currentPersona.avatarColor,
            width: compact ? '24px' : '32px',
            height: compact ? '24px' : '32px'
          }}
        >
          <UserCircle className={`text-white ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </span>
        
        {!compact && (
          <>
            <div className="text-left">
              <div className="text-sm font-medium text-white">{currentPersona.name}</div>
              <div className="text-xs text-gray-400">{currentPersona.title}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </>
        )}
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 w-64 rounded-lg border border-white/10 bg-dark-800/95 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="p-1">
            <div className="p-2 text-xs font-semibold text-gray-400 uppercase">
              Art Critics
            </div>
            <ul role="listbox">
              {artCriticPersonas.map((persona) => (
                <li key={persona.id} role="option" aria-selected={currentPersona.id === persona.id}>
                  <button
                    className={`w-full text-left flex items-start gap-2 p-2 rounded-md ${
                      currentPersona.id === persona.id ? 'bg-primary/20' : 'hover:bg-white/5'
                    }`}
                    onClick={() => handleSelectPersona(persona)}
                  >
                    <span 
                      className="rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                      style={{ 
                        backgroundColor: persona.avatarColor,
                        width: '28px',
                        height: '28px'
                      }}
                    >
                      <UserCircle className="w-4 h-4 text-white" />
                      {currentPersona.id === persona.id && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </span>
                    
                    <div>
                      <div className="text-sm font-medium text-white flex items-center">
                        {persona.name}
                      </div>
                      <div className="text-xs text-gray-400">{persona.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{persona.description}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}