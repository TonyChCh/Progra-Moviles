import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteEntry as deleteEntryFromDb,
  fetchAllEntries,
  insertEntry,
} from '../../db/bitacoraRepository';
import type { BitacoraEntry, NewBitacoraEntry } from '../types/bitacora';

export type { BitacoraEntry, NewBitacoraEntry };

interface BitacoraContextValue {
  entries: BitacoraEntry[];
  addEntry: (entry: NewBitacoraEntry) => void;
  deleteEntry: (id: string) => Promise<void>;
}

const BitacoraContext = createContext<BitacoraContextValue | undefined>(undefined);

export function BitacoraProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<BitacoraEntry[]>([]);

  useEffect(() => {
    fetchAllEntries()
      .then(setEntries)
      .catch((err) => console.error('Error cargando entradas:', err));
  }, []);

  const addEntry = (entry: NewBitacoraEntry) => {
    void insertEntry(entry)
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

export function useBitacora(): BitacoraContextValue {
  const context = useContext(BitacoraContext);
  if (!context) {
    throw new Error('useBitacora debe usarse dentro de BitacoraProvider');
  }
  return context;
}
