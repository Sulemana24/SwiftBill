// contexts/BalanceContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);

  // Load balance from localStorage, but only if it belongs to current user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user")) || {};

      // Only set balance if we have a valid user with balance
      if (userData._id && userData.walletBalance !== undefined) {
        setBalance(userData.walletBalance);
      } else {
        // Reset balance if no valid user data
        setBalance(0);
      }
    }
  }, []);

  // Function to reset balance (useful when logging out)
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
