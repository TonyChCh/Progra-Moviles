import React, { createContext, useState, useContext } from 'react';

export interface BitacoraEntry {
  id: string;
  uri: string;
  location: string;
  audioKey: string;
}

interface BitacoraContextType {
  entries: BitacoraEntry[];
  addEntry: (entry: BitacoraEntry) => void;
}

const BitacoraContext = createContext<BitacoraContextType | undefined>(undefined);

export function BitacoraProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<BitacoraEntry[]>([]);
  
  const addEntry = (entry: BitacoraEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  return (
    <BitacoraContext.Provider value={{ entries, addEntry }}>
      {children}
    </BitacoraContext.Provider>
  );
}

export const useBitacora = () => {
  const context = useContext(BitacoraContext);
  if (!context) throw new Error("useBitacora debe usarse dentro de BitacoraProvider");
  return context;
};