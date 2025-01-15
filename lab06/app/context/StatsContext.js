"use client";
import { createContext, useContext, useState } from 'react';

const StatsContext = createContext({
  numberFormat: 'rounded', // Domyślny format liczb
  sortBy: 'date',            // Domyślne sortowanie po dacie
  viewType: 'table',         // Domyślny widok tabeli
  updatePreferences: () => {}
});

export const StatsProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    numberFormat: 'rounded',
    sortBy: 'date',
    viewType: 'table'
  });

  const updatePreferences = (newPreferences) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <StatsContext.Provider value={{ ...preferences, updatePreferences }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsContext = () => useContext(StatsContext);
