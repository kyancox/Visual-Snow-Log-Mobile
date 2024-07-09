import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

type RefreshContext = {
    refresh: boolean
    triggerRefresh: () => void
}

const RefreshContext = createContext<RefreshContext>({
  refresh: false,
  triggerRefresh: () => {},
});

export const RefreshProvider = ({ children }: PropsWithChildren) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);