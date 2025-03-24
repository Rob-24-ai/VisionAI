import { createContext, useContext, useState, ReactNode } from 'react';
import { Persona, defaultPersona } from '../lib/personas';

interface PersonaContextType {
  currentPersona: Persona;
  setCurrentPersona: (persona: Persona) => void;
}

// Create context with default values
const PersonaContext = createContext<PersonaContextType>({
  currentPersona: defaultPersona,
  setCurrentPersona: () => {},
});

// Context provider component
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>(defaultPersona);

  return (
    <PersonaContext.Provider value={{ currentPersona, setCurrentPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

// Custom hook to use the persona context
export function usePersona() {
  return useContext(PersonaContext);
}