import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlyerData } from '@/types/flyer';
import { defaultFlyerData } from '@/data/defaultFlyerData';

interface FlyerContextType {
    data: FlyerData;
    updateData: (newData: FlyerData) => void;
    resetData: () => void;
    isLoading: boolean;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export function FlyerProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<FlyerData>(defaultFlyerData);
    const [isLoading, setIsLoading] = useState(false); // Can be used for async fetches later

    const updateData = (newData: FlyerData) => {
        setData(newData);
    };

    const resetData = () => {
        setData(defaultFlyerData);
    };

    return (
        <FlyerContext.Provider value={{ data, updateData, resetData, isLoading }}>
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
