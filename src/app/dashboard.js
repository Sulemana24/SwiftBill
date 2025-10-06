"use client";
import { useState, useEffect } from "react";
import {
  FaBolt,
  FaMobile,
  FaComment,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCreditCard,
  FaShieldAlt,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import ServiceModal from "../../components/ServiceModal";
import { useToast } from "../../components/Toast";
import Link from "next/link";

// ---------- Instructions Component ----------
const Instructions = () => {
  const steps = [
    {
      title: "Top Up Your Wallet",
      description: "Add funds to your account balance before making purchases",
      icon: FaCreditCard,
      color: "bg-blue-500",
    },
    {
      title: "Choose Your Service",
      description:
        "Select from Internet Data, SMS Bundles, or Electricity Payments",
      icon: FaQuestionCircle,
      color: "bg-purple-500",
    },
    {
      title: "Select Network & Details",
      description:
        "Choose your network provider and enter required information",
      icon: FaMobile,
      color: "bg-green-500",
    },
    {
      title: "Complete Purchase",
      description:
        "Confirm transaction details and complete your purchase securely",
      icon: FaShieldAlt,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FaQuestionCircle className="w-5 h-5 text-blue-600" />
          <span>How to Use SwiftBill</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Follow these simple steps to purchase bundles and pay bills
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div
                className={`${step.color} p-2 rounded-lg text-white flex-shrink-0`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <FaExclamationTriangle className="w-4 h-4" />
            <span>Important Notes</span>
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Ensure you have sufficient balance before making purchases
            </li>
            <li>
              • Double-check phone numbers and meter numbers before confirming
            </li>
            <li>
              • Data and SMS bundles are delivered instantly after payment
            </li>
            <li>• Electricity payments may take 5-10 minutes to reflect</li>
            <li>• Keep your transaction receipts for future reference</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ---------- OrderHistory Component ----------
const OrderHistory = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Completed
          </span>
        );
      case "processing":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Processing
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case "internet":
        return <FaMobile className="w-5 h-5 text-blue-500" />;
      case "sms":
        return <FaComment className="w-5 h-5 text-purple-500" />;
      case "electricity":
        return <FaBolt className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Safe amount formatting
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
  };

  // Safe date formatting
  const formatDate = (date) => {
    if (!date) return "Unknown date";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track your purchase history and status
        </p>
      </div>
      <div className="p-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.orderNumber || order._id || `order-${index}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getServiceIcon(order.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.description || "No description"}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Order No:{" "}
                      <span className="font-semibold">
                        {order.orderNumber || "N/A"}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{order.recipient || "No recipient"}</span>
                      {order.network && (
                        <>
                          <span>•</span>
                          <span>{order.network}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(order.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₵{formatAmount(order.amount)}
                    </p>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Dashboard Component ----------
export default function Dashboard({
  user: initialUser,
  walletBalance,
  onBalanceUpdate,
}) {
  const [user, setUser] = useState(initialUser);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { showToast } = useToast();

  // ---------- Time-based Greeting Function ----------
  const getGreetingWithEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good morning", emoji: "☀️" };
    if (hour < 18) return { greeting: "Good afternoon", emoji: "🌞" };
    return { greeting: "Good evening", emoji: "🌙" };
  };

  // ---------- Fetch Orders ----------
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = user?._id;

      if (!userId) {
        console.log("No user ID found for fetching orders");
        return;
      }

      try {
        const res = await fetch(`/api/orders/history?userId=${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }

        const data = await res.json();
        console.log("📦 Orders API response:", data);

        const orders = Array.isArray(data?.orders) ? data.orders : [];
        console.log("📦 Processed orders:", orders);

        setRecentOrders(orders.reverse());
      } catch (err) {
        console.error("Fetch orders error:", err);
        setRecentOrders([]);
      }
    };

    fetchOrders();
  }, [user?._id]);

  // ---------- Stats for Services ----------
  const stats = [
    {
      title: "Internet Data",
      icon: <FaMobile />,
      value: "Buy data bundles for any network",
      buttonText: "Get Started",
      type: "internet",
    },
    {
      title: "SMS Bundles",
      icon: <FaComment />,
      value: "Purchase SMS bundles for any network",
      buttonText: "Get Started",
      type: "sms",
    },
    {
      title: "Electricity Payments",
      icon: <FaBolt />,
      value: "Pay your electricity bills quickly and securely",
      buttonText: "Get Started",
      type: "electricity",
    },
  ];

  const handleServiceClick = (serviceType) => {
    setSelectedService(serviceType);
    setIsModalOpen(true);
  };

  // ---------- Handle Purchase ----------
  const handlePurchase = async (purchaseData) => {
    const userId = user?._id || user?.id;

    if (!userId) {
      showToast({
        type: "error",
        title: "Error",
        message: "User not found. Please log in again.",
      });
      return { success: false, error: "User not found" };
    }

    const purchaseAmount = purchaseData.amount;

    // Double-check balance (in case state is stale)
    if (purchaseAmount > walletBalance) {
      showToast({
        type: "error",
        title: "Insufficient Balance",
        message: `You need ₵${purchaseAmount.toFixed(
          2
        )} but only have ₵${walletBalance.toFixed(2)}`,
      });
      return { success: false, error: "Insufficient balance" };
    }

    const newOrder = {
      type: purchaseData.serviceType,
      description:
        purchaseData.serviceType === "electricity"
          ? `Electricity Payment (${purchaseData.electricityType})`
          : `${purchaseData.serviceType} Bundle - ${purchaseData.network}`,
      amount: purchaseAmount,
      recipient:
        purchaseData.serviceType === "electricity"
          ? `Meter: ${purchaseData.meterNumber}`
          : purchaseData.mobileNumber,
      network: purchaseData.network || null,
      status: "completed",
      date: new Date(),
      orderNumber: `SWI${Math.floor(100000 + Math.random() * 900000)}`,
    };

    try {
      console.log("🔄 Sending purchase request:", { userId, ...newOrder });

      const res = await fetch("/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          ...newOrder,
        }),
      });

      console.log("🔄 API Response status:", res.status);

      const data = await res.json();
      console.log("🔄 API Response data:", data);

      if (!res.ok) {
        console.error("❌ API Error:", data.error);
        throw new Error(data.error || "Failed to save order");
      }

      if (data.balance !== undefined) {
        onBalanceUpdate(data.balance);

        const userData = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = {
          ...userData,
          walletBalance: data.balance,
          balance: data.balance,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      //Update orders list
      setRecentOrders((prev) => [data.order, ...prev.slice(0, 4)]);

      showToast({
        type: "success",
        title: "Purchase Successful!",
        message: `You purchased ${
          purchaseData.serviceType
        } for ₵${purchaseAmount.toFixed(
          2
        )}. New balance: ₵${data.balance.toFixed(2)}`,
      });

      return {
        success: true,
        newBalance: data.balance,
      };
    } catch (err) {
      console.error("❌ Order API error:", err);
      showToast({
        type: "error",
        title: "Purchase Failed",
        message: err.message || "Could not complete order",
      });
      return { success: false, error: err.message };
    }
  };

  // ---------- Render ----------
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get greeting once for consistent rendering
  const { greeting, emoji } = getGreetingWithEmoji();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">
              {emoji} {greeting}, {user.name?.split(" ")[0] || "Guest"}!
            </h1>
            <p className="text-black mb-3">
              Choose from our services below to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <span className="text-xl text-blue-600">{stat.icon}</span>
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm font-bold text-gray-900 mb-6">
                  {stat.value}
                </p>
                <button
                  onClick={() => handleServiceClick(stat.type)}
                  className="w-full bg-blue-800 hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-medium transition-all duration-200 group-hover:shadow-lg cursor-pointer"
                >
                  {stat.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Order History and Instructions in Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <OrderHistory orders={recentOrders} />
            <Instructions />
          </div>
        </main>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceType={selectedService}
        onPurchase={handlePurchase}
        walletBalance={walletBalance}
      />
    </div>
  );
}
