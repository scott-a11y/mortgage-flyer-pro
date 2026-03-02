import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FlyerContextType {
  // Add any flyer-related state and methods here
  selectedFlyer: any | null;
  setSelectedFlyer: (flyer: any) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export const FlyerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFlyer, setSelectedFlyer] = useState<any | null>(null);

  return (
    <FlyerContext.Provider value={{ selectedFlyer, setSelectedFlyer }}>
      {children}
    </FlyerContext.Provider>
  );
};

export const useFlyer = () => {
  const context = useContext(FlyerContext);
  if (context === undefined) {
    throw new Error('useFlyer must be used within a FlyerProvider');
  }
  return context;
};