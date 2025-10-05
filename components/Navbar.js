// components/Navbar.js
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import TopUpModal from "./TopUpModal";
import { FaWallet, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useBalance } from "../components/BalanceContext";

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { balance, setBalance, resetBalance } = useBalance();
  const router = useRouter();

  const userId = user?._id;
  const userEmail = user?.email;

  // Fetch fresh balance whenever user changes
  useEffect(() => {
    if (!userId) {
      // If no user, reset balance
      resetBalance();
      return;
    }

    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user?.balance !== undefined) {
            setBalance(data.user.balance);
            // Update localStorage with current user's data
            const userData = JSON.parse(localStorage.getItem("user")) || {};
            const updatedUser = {
              ...userData,
              walletBalance: data.user.balance,
              _id: userId, // Ensure we have the current user's ID
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    fetchBalance();
  }, [userId, setBalance, resetBalance]);

  const handleLogout = () => {
    // Clear localStorage and reset balance
    localStorage.removeItem("user");
    resetBalance();

    if (onLogout) onLogout();
    else router.push("/login");
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "G";

  return (
    <>
      <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/assets/favicon.png"
                alt="SwiftBill Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-xl font-bold text-blue-800">SwiftBill</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-blue-100 px-4 py-2 rounded-lg">
                <FaWallet className="text-blue-800" />
                <span className="font-semibold text-blue-800">
                  Ghc{Number(balance || 0).toFixed(2)}
                </span>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="ml-2 px-3 py-1 rounded bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-medium"
                >
                  Top Up
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">
                  {getInitials(user.name)}
                </div>
                <p className="text-sm font-medium text-blue-900">{user.name}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 border px-3 py-1 rounded border-blue-300 text-blue-800 hover:bg-blue-100 text-sm font-medium"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-700 text-2xl focus:outline-none"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="sm:hidden mt-4 space-y-4 pb-4 border-t border-blue-100">
              <div className="flex items-center justify-between bg-blue-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaWallet className="text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Ghc{Number(balance || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="px-3 py-1 rounded bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-medium"
                >
                  Top Up
                </button>
              </div>

              <div className="flex items-center space-x-3 px-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="px-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 border px-3 py-2 rounded border-blue-300 text-blue-700 hover:bg-blue-100 text-sm font-medium"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        userId={user?._id}
        currentBalance={balance}
        onBalanceUpdate={setBalance}
        userEmail={user?.email}
      />
    </>
  );
}
