import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllEntries, insertEntry, deleteEntry as deleteEntryFromDb } from '../../db/bitacoraRepository';

export interface BitacoraEntry {
  id: string;
  uri: string;
  location: string;
  audioKey: string;
}

interface BitacoraContextType {
  entries: BitacoraEntry[];
  addEntry: (entry: BitacoraEntry) => void;
  deleteEntry: (id: string) => Promise<void>;
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

  const deleteEntry = async (id: string) => {
    try {
      await deleteEntryFromDb(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('Error eliminando entrada:', err);
      throw err;
    }
  };

  return (
    <BitacoraContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </BitacoraContext.Provider>
  );
}

export const useBitacora = () => {
  const context = useContext(BitacoraContext);
  if (!context) throw new Error("useBitacora debe usarse dentro de BitacoraProvider");
  return context;
};
