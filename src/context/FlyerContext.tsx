import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { FlyerData, BrokerContact, CompanyContact } from '@/types/flyer';
import { defaultFlyerData } from '@/data/defaultFlyerData';
import { AgentPartner, agentPartners } from '@/data/agentPartners';

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const CUSTOM_PARTNERS_KEY = 'mortgage-flyer-custom-partners';
const BROKER_DEFAULTS_KEY = 'mortgage-flyer-broker-defaults';
const COMPANY_DEFAULTS_KEY = 'mortgage-flyer-company-defaults';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface FlyerContextType {
  /** The current flyer data (always defined — falls back to defaults). */
  data: FlyerData;
  /** Merge partial updates into the flyer data object. */
  updateData: (updates: Partial<FlyerData> | ((prev: FlyerData) => FlyerData)) => void;
  /** Reset to factory defaults. */
  resetData: () => void;
  /** True while initial hydration is in progress (reserved for future async load). */
  isLoading: boolean;

  // Partner registry ---
  /** Combined list of built-in + user-created agent partners. */
  partners: AgentPartner[];
  /** Add or update a partner entry (persists custom ones to localStorage). */
  savePartner: (partner: AgentPartner) => void;
  /** Delete a partner by id. */
  deletePartner: (id: string) => void;

  // Default-saving helpers ---
  saveBrokerDefaults: (broker: BrokerContact) => void;
  saveCompanyDefaults: (company: CompanyContact) => void;

  // Legacy aliases kept for any callers that still reference them:
  currentFlyer: FlyerData;
  setCurrentFlyer: (flyer: FlyerData) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function mergedPartners(customPartners: AgentPartner[]): AgentPartner[] {
  // Start with built-ins, override with any matching custom entries, then add
  // remaining custom partners that don't match a built-in id.
  const builtInIds = new Set(agentPartners.map(p => p.id));
  const customById = new Map(customPartners.map(p => [p.id, p]));

  const merged: AgentPartner[] = agentPartners.map(p => customById.get(p.id) ?? p);

  // Add purely-custom partners (ids not in built-in list)
  for (const cp of customPartners) {
    if (!builtInIds.has(cp.id)) {
      merged.push(cp);
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function FlyerProvider({ children }: { children: ReactNode }) {
  // Hydrate broker/company defaults from localStorage on mount
  const initialData: FlyerData = {
    ...defaultFlyerData,
    broker: { ...defaultFlyerData.broker, ...loadJSON<Partial<BrokerContact>>(BROKER_DEFAULTS_KEY, {}) },
    company: { ...defaultFlyerData.company, ...loadJSON<Partial<CompanyContact>>(COMPANY_DEFAULTS_KEY, {}) },
  };

  const [data, setData] = useState<FlyerData>(initialData);
  const [customPartners, setCustomPartners] = useState<AgentPartner[]>(() =>
    loadJSON<AgentPartner[]>(CUSTOM_PARTNERS_KEY, [])
  );

  // Persist custom partners whenever they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_PARTNERS_KEY, JSON.stringify(customPartners));
  }, [customPartners]);

  const partners = mergedPartners(customPartners);

  // --- data management ---
  const updateData = useCallback(
    (updates: Partial<FlyerData> | ((prev: FlyerData) => FlyerData)) => {
      setData(prev =>
        typeof updates === 'function'
          ? updates(prev)
          : { ...prev, ...updates }
      );
    },
    []
  );

  const resetData = useCallback(() => {
    setData(initialData);
  }, []);

  // --- partner registry ---
  const savePartner = useCallback((partner: AgentPartner) => {
    setCustomPartners(prev => {
      const exists = prev.findIndex(p => p.id === partner.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = partner;
        return next;
      }
      return [...prev, partner];
    });
  }, []);

  const deletePartner = useCallback((id: string) => {
    setCustomPartners(prev => prev.filter(p => p.id !== id));
  }, []);

  // --- defaults persistence ---
  const saveBrokerDefaults = useCallback((broker: BrokerContact) => {
    localStorage.setItem(BROKER_DEFAULTS_KEY, JSON.stringify(broker));
    import('sonner').then(m => m.toast.success('Broker defaults saved'));
  }, []);

  const saveCompanyDefaults = useCallback((company: CompanyContact) => {
    localStorage.setItem(COMPANY_DEFAULTS_KEY, JSON.stringify(company));
    import('sonner').then(m => m.toast.success('Company defaults saved'));
  }, []);

  const value: FlyerContextType = {
    data,
    updateData,
    resetData,
    isLoading: false,

    partners,
    savePartner,
    deletePartner,
    saveBrokerDefaults,
    saveCompanyDefaults,

    // Legacy aliases
    currentFlyer: data,
    setCurrentFlyer: setData,
  };

  return (
    <FlyerContext.Provider value={value}>
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