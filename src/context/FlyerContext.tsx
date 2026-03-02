import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FlyerContextType {
  // Add your flyer context properties here
  flyerData: any;
  setFlyerData: (data: any) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export const FlyerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flyerData, setFlyerData] = useState<any>(null);

  return (
    <FlyerContext.Provider value={{ flyerData, setFlyerData }}>
      {children}
    </FlyerContext.Provider>
  );
};

export const useFlyer = () => {
  const context = useContext(FlyerContext);
  if (!context) {
    throw new Error('useFlyer must be used within a FlyerProvider');
  }
  return context;
};