import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

interface MesaContextType {
  mesaNumber: string | null;
  isMesaMode: boolean;
}

const MesaContext = createContext<MesaContextType>({ mesaNumber: null, isMesaMode: false });

export function MesaProvider({ children }: { children: React.ReactNode }) {
  const { mesaNumber } = useParams<{ mesaNumber?: string }>();
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
