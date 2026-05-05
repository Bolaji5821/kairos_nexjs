"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Intent = "talent" | "company";

interface IntentContextType {
  intent: Intent;
  setIntent: (intent: Intent) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const IntentContext = createContext<IntentContextType | undefined>(undefined);

export function IntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<Intent>("talent");
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedIntent = localStorage.getItem("kairos_intent") as Intent;
    if (savedIntent) {
      setIntent(savedIntent);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleSetIntent = (newIntent: Intent) => {
    setIntent(newIntent);
    localStorage.setItem("kairos_intent", newIntent);
    setShowModal(false);
  };

  if (!mounted) return null;

  return (
    <IntentContext.Provider 
      value={{ 
        intent, 
        setIntent: handleSetIntent, 
        showModal, 
        setShowModal 
      }}
    >
      {children}
    </IntentContext.Provider>
  );
}

export function useIntent() {
  const context = useContext(IntentContext);
  if (context === undefined) {
    throw new Error("useIntent must be used within an IntentProvider");
  }
  return context;
}
