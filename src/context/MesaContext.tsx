"use client";
import React, { createContext, useContext } from 'react';
import { useParams } from 'next/navigation';

interface MesaContextType {
  mesaNumber: string | null;
  isMesaMode: boolean;
}

const MesaContext = createContext<MesaContextType>({ mesaNumber: null, isMesaMode: false });

export function MesaProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const mesaNumber = params?.mesaNumber as string | undefined;
  
  return (
    <MesaContext.Provider value={{
      mesaNumber: mesaNumber || null,
      isMesaMode: !!mesaNumber,
    }}>
      {children}
    </MesaContext.Provider>
  );
}

export const useMesa = () => useContext(MesaContext);
