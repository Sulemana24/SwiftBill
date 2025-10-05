"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import Dashboard from "../src/app/dashboard";
import LoginForm from "./Login";
import { useToast } from "./Toast";
import { useBalance } from "../components/BalanceContext";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const { balance, setBalance, resetBalance } = useBalance();

  // Check login on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    if (userData && userData._id) {
      setUser(userData);
      // Use the balance from BalanceContext (which loads from localStorage)
      setIsLoggedIn(true);
    }
    setIsLoading(false);

    // --- Handle Paystack callback automatically ---
    const query = new URLSearchParams(window.location.search);
    const reference = query.get("reference");
    const userId = query.get("userId");

    if (reference && userId) {
      verifyPayment(reference, userId);
    }
  }, []);

  const verifyPayment = async (reference, userId) => {
    try {
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, userId }),
      });

      const data = await res.json();

      if (data.success) {
        // Update BalanceContext and localStorage
        setBalance(data.newBalance);

        const userData = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = { ...userData, walletBalance: data.newBalance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        showToast({
          type: "success",
          title: "Top-up Successful!",
          message: `New Balance: Ghc${data.newBalance.toFixed(2)}`,
        });

        // Clean URL
        router.replace(window.location.pathname);
      } else {
        showToast({
          type: "error",
          title: "Payment Failed",
          message: "Payment verification failed. Please try again.",
        });
        router.replace(window.location.pathname);
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Error",
        message: "An error occurred during payment verification.",
      });
      router.replace(window.location.pathname);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    resetBalance(); // Reset the global balance context
    setIsLoggedIn(false);

    showToast({
      type: "success",
      title: "Logged out successfully",
      message: "You have been logged out successfully",
    });

    router.push("/");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setBalance(userData.walletBalance || 0); // Update global balance context
    setIsLoggedIn(true);

    // localStorage is already set in LoginForm, no need to set here

    showToast({
      type: "success",
      title: "Login Successful!",
      message: `Welcome back, ${userData.name}!`,
    });

    router.push("/");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setBalance(userData.walletBalance || 0); // Update global balance context
    setIsLoggedIn(true);

    // localStorage is already set in LoginForm, no need to set here

    showToast({
      type: "success",
      title: "Account Created!",
      message: `Welcome to SwiftBill, ${userData.name}!`,
    });

    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogout={handleLogout}
        // Remove walletBalance and onBalanceUpdate props - Navbar uses BalanceContext
      />
      <Dashboard
        user={user}
        walletBalance={balance} // Use balance from BalanceContext
        onBalanceUpdate={setBalance} // Use setBalance from BalanceContext
      />
    </div>
  );
}
