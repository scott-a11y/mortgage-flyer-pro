import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FlyerContextType {
  // Add flyer-related state and methods here
  currentFlyer: any;
  setCurrentFlyer: (flyer: any) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export function FlyerProvider({ children }: { children: ReactNode }) {
  const [currentFlyer, setCurrentFlyer] = useState(null);

  return (
    <FlyerContext.Provider value={{ currentFlyer, setCurrentFlyer }}>
      {children}
    </FlyerContext.Provider>
  );
}

export function useFlyer() {
  const context = useContext(FlyerContext);
  if (context === undefined) {
    throw new Error('useFlyer must be used within a FlyerProvider');
  }
  return context;
}