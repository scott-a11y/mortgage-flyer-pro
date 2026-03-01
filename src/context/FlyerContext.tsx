import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlyerData } from '@/types/flyer';
import { defaultFlyerData } from '@/data/defaultFlyerData';
import { AgentPartner, agentPartners as defaultPartners } from '@/data/agentPartners';
import { toast } from 'sonner';

const CUSTOM_PARTNERS_KEY = "mortgage-flyer-custom-partners";
const BROKER_DEFAULTS_KEY = "mortgage-flyer-broker-defaults";
const COMPANY_DEFAULTS_KEY = "mortgage-flyer-company-defaults";

interface FlyerContextType {
    data: FlyerData;
    updateData: (newData: FlyerData) => void;
    resetData: () => void;
    isLoading: boolean;
    partners: AgentPartner[];
    savePartner: (partner: AgentPartner) => void;
    deletePartner: (id: string) => void;
    saveBrokerDefaults: (broker: FlyerData["broker"]) => void;
    saveCompanyDefaults: (company: FlyerData["company"]) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export function FlyerProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<FlyerData>(defaultFlyerData);
    const [isLoading, setIsLoading] = useState(false);
    const [customPartners, setCustomPartners] = useState<AgentPartner[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(CUSTOM_PARTNERS_KEY);
        const brokerSaved = localStorage.getItem(BROKER_DEFAULTS_KEY);
        const companySaved = localStorage.getItem(COMPANY_DEFAULTS_KEY);

        if (saved) {
            try { setCustomPartners(JSON.parse(saved)); } catch (e) { console.error('Error parsing custom partners:', e); }
        }

        if (brokerSaved || companySaved) {
            try {
                const broker = brokerSaved ? JSON.parse(brokerSaved) : undefined;
                const company = companySaved ? JSON.parse(companySaved) : undefined;

                // Auto-repair old headshot paths in defaults
                if (broker && broker.headshot?.endsWith('-headshot.jpg')) {
                    broker.headshot = broker.headshot.replace('.jpg', '.png');
                    localStorage.setItem(BROKER_DEFAULTS_KEY, JSON.stringify(broker));
                }

                setData(prev => ({
                    ...prev,
                    broker: broker || prev.broker,
                    company: company || prev.company,
                }));
            } catch (e) { console.error('Error parsing defaults:', e); }
        }
    }, []);

    const saveBrokerDefaults = (broker: FlyerData["broker"]) => {
        localStorage.setItem(BROKER_DEFAULTS_KEY, JSON.stringify(broker));
        toast.success("Broker information set as future default");
    };

    const saveCompanyDefaults = (company: FlyerData["company"]) => {
        localStorage.setItem(COMPANY_DEFAULTS_KEY, JSON.stringify(company));
        toast.success("Company information set as future default");
    };

    const partners = React.useMemo(() => {
        const customIds = new Set(customPartners.map(p => p.id));
        const filteredDefaults = defaultPartners.filter(p => !customIds.has(p.id));
        return [...filteredDefaults, ...customPartners];
    }, [customPartners]);

    const savePartner = (partner: AgentPartner) => {
        const updated = customPartners.find(p => p.id === partner.id)
            ? customPartners.map(p => p.id === partner.id ? partner : p)
            : [...customPartners, partner];

        setCustomPartners(updated);
        localStorage.setItem(CUSTOM_PARTNERS_KEY, JSON.stringify(updated));
    };

    const deletePartner = (id: string) => {
        const updated = customPartners.filter(p => p.id !== id);
        setCustomPartners(updated);
        localStorage.setItem(CUSTOM_PARTNERS_KEY, JSON.stringify(updated));
    };

    const updateData = (newData: FlyerData) => {
        setData(newData);
    };

    const resetData = () => {
        setData(defaultFlyerData);
    };

    return (
        <FlyerContext.Provider value={{
            data,
            updateData,
            resetData,
            isLoading,
            partners,
            savePartner,
            deletePartner,
            saveBrokerDefaults,
            saveCompanyDefaults
        }}>
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
