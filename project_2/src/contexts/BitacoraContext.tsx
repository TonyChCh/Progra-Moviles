import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllEntries, insertEntry } from '../../db/bitacoraRepository';

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

  useEffect(() => {
    fetchAllEntries()
      .then(setEntries)
      .catch((err) => console.error('Error cargando entradas:', err));
  }, []);

  const addEntry = (entry: BitacoraEntry) => {
    void insertEntry({
      uri: entry.uri,
      location: entry.location,
      audioKey: entry.audioKey,
    })
      .then((created) => setEntries((prev) => [created, ...prev]))
      .catch((err) => console.error('Error guardando entrada:', err));
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
