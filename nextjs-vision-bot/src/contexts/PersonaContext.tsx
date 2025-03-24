'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Persona, defaultPersona } from '@/lib/personas';

interface PersonaContextType {
  currentPersona: Persona;
  setCurrentPersona: (persona: Persona) => void;
}

// Create context with default persona
const PersonaContext = createContext<PersonaContextType>({
  currentPersona: defaultPersona,
  setCurrentPersona: () => {}
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>(defaultPersona);
  
  return (
    <PersonaContext.Provider value={{ currentPersona, setCurrentPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}