"use client";
import { useState } from "react";
import {
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Image from "next/image";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Send reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return alert("Enter your email.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Enter a valid email.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowReset(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password using code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match.");
    if (!resetCode || !newPassword) return alert("All fields are required.");

    setIsResetting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: resetCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Step 3: Render password reset form
  if (showReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" /> Back to Login
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Reset Password
          </h2>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reset Code
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter the code sent to your email"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full py-3 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            You can now log in with your new password.
          </p>
          <button
            onClick={onBack}
            className="py-2 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Initial forgot-password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full px-3 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
