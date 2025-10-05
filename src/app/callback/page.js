// app/callback/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBalance } from "../../../components/BalanceContext";

export default function PaystackCallbackPage() {
  const router = useRouter();
  const { setBalance } = useBalance();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const reference = query.get("reference");
        const userId = query.get("userId");

        if (!reference || !userId) {
          router.push("/");
          return;
        }

        // Get current user from localStorage to verify it's the same user
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};

        if (currentUser._id !== userId) {
          console.warn("User ID mismatch during payment verification");
          // Still proceed with verification, but log the issue
        }

        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, userId }),
        });

        const data = await res.json();

        if (data.success) {
          // Update global balance state
          setBalance(data.newBalance);

          // Update localStorage only if it's the same user
          const userData = JSON.parse(localStorage.getItem("user")) || {};
          if (userData._id === userId) {
            const updatedUser = { ...userData, walletBalance: data.newBalance };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }

          alert(
            `Top up successful! New Balance: Ghc${data.newBalance.toFixed(2)}`
          );
          router.push("/");
        } else {
          alert("Payment verification failed!");
          router.push("/");
        }
      } catch (err) {
        console.error("Verification error:", err);
        alert("An error occurred during payment verification.");
        router.push("/");
      }
    };

    verifyPayment();
  }, [router, setBalance]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Processing payment...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  );
}
