"use client";
import { createContext, useContext, useState, useEffect } from "react";

const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user")) || {};

      if (userData._id && userData.walletBalance !== undefined) {
        setBalance(userData.walletBalance);
      } else {
        setBalance(0);
      }
    }
  }, []);

  const resetBalance = () => {
    setBalance(0);
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance, resetBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
