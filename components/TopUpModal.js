"use client";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { useToast } from "./Toast";

const quickAmounts = [10, 25, 50, 100];

export default function TopUpModal({
  isOpen,
  onClose,
  userId,
  currentBalance,
  onBalanceUpdate,
  userEmail,
}) {
  const [amount, setAmount] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  if (!isOpen) return null;

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
    setSelectedQuick(value);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setSelectedQuick(null);
  };

  const handleTopUp = async () => {
    const topUpAmount = parseFloat(amount);

    // 🔒 Check authentication
    if (!userEmail || !userId) {
      showToast({
        type: "error",
        title: "Not Logged In",
        message: "Please log in or sign up to top up your wallet.",
      });
      return;
    }

    if (!topUpAmount || topUpAmount < 10) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        message: "Minimum top-up amount is GHC10.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: topUpAmount,
          email: userEmail,
          userId,
        }),
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        showToast({
          type: "error",
          title: "Payment Failed",
          message: data.error || "Payment initialization failed.",
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Server Error",
        message: "Something went wrong. Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setAmount("");
    setSelectedQuick(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-lg z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaWallet className="text-yellow-500 text-lg" />
          <h2 className="text-lg font-semibold text-black">Top Up Wallet</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Add funds to your account to purchase services
        </p>

        <div className="text-center p-4 bg-blue-800 rounded-lg mb-4">
          <p className="text-xs text-gray-200">Current Balance</p>
          <p className="text-2xl font-bold">Ghc{currentBalance.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-black">
            Quick Amounts
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickAmounts.map((value) => (
              <button
                key={value}
                className={`p-3 text-black rounded-lg border text-sm font-medium transition-all ${
                  selectedQuick === value
                    ? "ring-2 ring-blue-800 bg-blue-50 border-blue-800"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
                onClick={() => handleQuickSelect(value)}
              >
                Ghc{value}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="custom-amount"
            className="text-sm font-medium block text-black mb-2"
          >
            Custom Amount (Ghc)
          </label>
          <input
            id="custom-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 focus:outline-none transition-all"
            min="10"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum amount: Ghc10</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-gray-200 mt-5">
          <div className="text-base font-semibold text-black">
            {amount && parseFloat(amount) > 0
              ? `+Ghc${parseFloat(amount).toFixed(2)}`
              : "Ghc0.00"}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleTopUp}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              className="w-full sm:w-auto bg-yellow-400 text-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Redirecting...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              You will be redirected to Paystack to complete your payment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
