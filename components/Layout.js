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
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const { balance, setBalance, resetBalance } = useBalance();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const guestMode = localStorage.getItem("guestMode") === "true";

    if (userData && userData._id) {
      setUser(userData);
      setIsLoggedIn(true);
    } else if (guestMode) {
      setIsGuest(true);
      setUser({
        name: "Guest User",
        email: "guest@example.com",
        isGuest: true,
      });
    }

    setIsLoading(false);

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

  const handleGuestLogin = () => {
    const guestUser = {
      name: "Guest User",
      email: "guest@example.com",
      isGuest: true,
      walletBalance: 0,
    };

    setUser(guestUser);
    setIsGuest(true);
    setBalance(0);
    localStorage.setItem("guestMode", "true");

    showToast({
      type: "info",
      title: "Guest Mode Activated",
      message: "Explore our services! Sign up to make purchases.",
    });

    router.push("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("guestMode");
    setUser(null);
    resetBalance();
    setIsLoggedIn(false);
    setIsGuest(false);

    showToast({
      type: "success",
      title: "Logged out successfully",
      message: "You have been logged out successfully",
    });

    router.push("/");
  };

  const handleLogin = (userData) => {
    localStorage.removeItem("guestMode");
    setUser(userData);
    setBalance(userData.walletBalance || 0);
    setIsLoggedIn(true);
    setIsGuest(false);

    showToast({
      type: "success",
      title: "Login Successful!",
      message: `Welcome back, ${userData.name}!`,
    });

    router.push("/");
  };

  const handleSignup = (userData) => {
    localStorage.removeItem("guestMode");
    setUser(userData);
    setBalance(userData.walletBalance || 0);
    setIsLoggedIn(true);
    setIsGuest(false);

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

  if (!isLoggedIn && !isGuest) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} isGuest={isGuest} />
      <Dashboard
        user={user}
        walletBalance={balance}
        onBalanceUpdate={setBalance}
        isGuest={isGuest}
      />
    </div>
  );
}
