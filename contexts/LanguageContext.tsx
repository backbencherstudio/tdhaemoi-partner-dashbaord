'use client';

import React, { createContext, useContext, useState } from 'react';

type LanguageContextType = {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({ selectedLang: 'de', setSelectedLang: () => { } });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLang, setSelectedLang] = useState('de');

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang }}>
      {children}
    </LanguageContext.Provider>
  );
}


export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}