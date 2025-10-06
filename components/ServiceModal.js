import { useState } from "react";
import {
  FaMobile,
  FaComment,
  FaBolt,
  FaTimes,
  FaWallet,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const ServiceModal = ({
  isOpen,
  onClose,
  serviceType,
  onPurchase,
  walletBalance = 0,
  showToast,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [electricityType, setElectricityType] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return cleaned.length === 10 && cleaned.startsWith("0");
  };

  const validateMeterNumber = (meterNumber) => {
    const cleaned = meterNumber.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  const getPhoneNumberError = (value) => {
    if (!value) return "Phone number is required";
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 10) return "Phone number must be 10 digits";
    if (!cleaned.startsWith("0")) return "Phone number must start with 0";
    return null;
  };

  const getMeterNumberError = (value) => {
    if (!value) return "Meter number is required";
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 10) return "Meter number must be 10 digits";
    return null;
  };

  const handleMobileNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(cleaned);
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: null }));
    }
  };

  const handleMeterNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setMeterNumber(cleaned);
    if (errors.meterNumber) {
      setErrors((prev) => ({ ...prev, meterNumber: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (serviceType === "internet" || serviceType === "sms") {
      const phoneError = getPhoneNumberError(mobileNumber);
      if (phoneError) newErrors.mobileNumber = phoneError;
    }

    if (serviceType === "electricity") {
      const meterError = getMeterNumberError(meterNumber);
      if (meterError) newErrors.meterNumber = meterError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Network-specific plans
  const networkPlans = {
    internet: {
      MTN: [
        { id: "mtn-1gb", name: "1GB Data", price: 5.0 },
        { id: "mtn-2gb", name: "2GB Data", price: 10.0 },
        { id: "mtn-3gb", name: "3GB Data", price: 14.5 },
        { id: "mtn-4gb", name: "4GB Data", price: 19.0 },
        { id: "mtn-5gb", name: "5GB Data", price: 24.0 },
        { id: "mtn-6gb", name: "6GB Data", price: 28.0 },
        { id: "mtn-8gb", name: "8GB Data", price: 35.5 },
        { id: "mtn-10gb", name: "10GB Data", price: 43.0 },
        { id: "mtn-15gb", name: "15GB Data", price: 62.0 },
        { id: "mtn-20gb", name: "20GB Data", price: 82.0 },
        { id: "mtn-25gb", name: "25GB Data", price: 103.0 },
        { id: "mtn-30gb", name: "30GB Data", price: 123.0 },
        { id: "mtn-40gb", name: "40GB Data", price: 161.0 },
        { id: "mtn-50gb", name: "50GB Data", price: 199.0 },
      ],
      Telecel: [
        { id: "telecel-1gb", name: "1GB Data", price: 4.5 },
        { id: "telecel-2gb", name: "2GB Data", price: 8.5 },
        { id: "telecel-5gb", name: "5GB Data", price: 18.0 },
        { id: "telecel-10gb", name: "10GB Data", price: 32.0 },
      ],
      AirtelTigo: [
        { id: "airtel-1gb", name: "1GB Data", price: 4.5 },
        { id: "airtel-2gb", name: "2GB Data", price: 8.5 },
        { id: "airtel-3gb", name: "3GB Data", price: 12.5 },
        { id: "airtel-4gb", name: "4GB Data", price: 17.0 },
        { id: "airtel-5gb", name: "5GB Data", price: 20.5 },
        { id: "airtel-6gb", name: "6GB Data", price: 24.5 },
        { id: "airtel-7gb", name: "7GB Data", price: 28.5 },
        { id: "airtel-8gb", name: "8GB Data", price: 32.5 },
        { id: "airtel-9gb", name: "9GB Data", price: 37.0 },
        { id: "airtel-10gb", name: "10GB Data", price: 30.0 },
        { id: "airtel-12gb", name: "12GB Data", price: 48.0 },
      ],
    },
    sms: {
      MTN: [
        { id: "mtn-50sms", name: "50 SMS", price: 2.0 },
        { id: "mtn-100sms", name: "100 SMS", price: 3.5 },
        { id: "mtn-200sms", name: "200 SMS", price: 6.0 },
        { id: "mtn-500sms", name: "500 SMS", price: 12.0 },
      ],
      Telecel: [
        { id: "telecel-50sms", name: "50 SMS", price: 1.8 },
        { id: "telecel-100sms", name: "100 SMS", price: 3.2 },
        { id: "telecel-200sms", name: "200 SMS ", price: 5.5 },
        { id: "telecel-500sms", name: "500 SMS ", price: 10.5 },
      ],
      AirtelTigo: [
        { id: "airtel-50sms", name: "50 SMS", price: 1.5 },
        { id: "airtel-100sms", name: "100 SMS ", price: 2.8 },
        { id: "airtel-200sms", name: "200 SMS", price: 5.0 },
        { id: "airtel-500sms", name: "500 SMS", price: 9.5 },
      ],
    },
  };

  const networks = ["MTN", "Telecel", "AirtelTigo"];

  const handlePurchase = async () => {
    if (!validateForm()) {
      if (showToast) {
        showToast({
          type: "error",
          title: "Validation Error",
          message: "Please fix the errors in the form before proceeding",
          icon: FaExclamationTriangle,
        });
      }
      return;
    }
    const purchaseAmount = getPurchaseAmount();

    // Check if user has sufficient balance
    if (purchaseAmount > walletBalance) {
      if (showToast) {
        showToast({
          type: "error",
          title: "Insufficient Balance",
          message: `You need ₵${purchaseAmount.toFixed(
            2
          )} but only have ₵${walletBalance.toFixed(2)}`,
          icon: FaExclamationTriangle,
        });
      }
      return;
    }

    // Validate form
    if (!isFormValid()) {
      if (showToast) {
        showToast({
          type: "error",
          title: "Missing Information",
          message: "Please fill in all required fields",
          icon: FaExclamationTriangle,
        });
      }
      return;
    }

    setIsProcessing(true);

    try {
      const purchaseData = {
        serviceType,
        network: selectedNetwork,
        mobileNumber: mobileNumber.replace(/\D/g, ""),
        plan: selectedPlan,
        meterNumber: meterNumber.replace(/\D/g, ""),
        electricityType,
        amount: purchaseAmount,
        timestamp: new Date().toISOString(),
      };

      // Call the onPurchase function and wait for the result
      const result = await onPurchase(purchaseData);

      if (result && result.success) {
        if (showToast) {
          showToast({
            type: "success",
            title: "Purchase Successful!",
            message: `${getServiceTitle()} purchased for ₵${purchaseAmount.toFixed(
              2
            )}`,
            icon: FaCheckCircle,
          });
        }

        onClose();
        resetForm();
      } else {
        throw new Error(result?.error || "Purchase failed");
      }
    } catch (error) {
      console.error("Purchase failed:", error);

      // Show error toast
      if (showToast) {
        showToast({
          type: "error",
          title: "Purchase Failed",
          message:
            error.message ||
            "Please try again. If the problem persists, contact support.",
          icon: FaExclamationTriangle,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedNetwork("");
    setMobileNumber("");
    setSelectedPlan("");
    setMeterNumber("");
    setElectricityType("");
    setAmount("");
    setIsProcessing(false);
    setErrors({});
  };

  const getSelectedPlanDetails = () => {
    if (selectedNetwork && selectedPlan) {
      const plans = networkPlans[serviceType][selectedNetwork];
      return plans.find((p) => p.id === selectedPlan);
    }
    return null;
  };

  const getPurchaseAmount = () => {
    if (serviceType === "electricity") {
      return parseFloat(amount) || 0;
    }

    if (selectedNetwork && selectedPlan) {
      const plans = networkPlans[serviceType][selectedNetwork];
      const plan = plans.find((p) => p.id === selectedPlan);
      return plan?.price || 0;
    }

    return 0;
  };

  const isFormValid = () => {
    if (serviceType === "electricity") {
      return (
        electricityType &&
        meterNumber &&
        amount &&
        parseFloat(amount) > 0 &&
        !errors.meterNumber
      );
    }
    return (
      selectedNetwork && mobileNumber && selectedPlan && !errors.mobileNumber
    );
  };

  const hasSufficientBalance = () => {
    const purchaseAmount = getPurchaseAmount();
    return purchaseAmount <= walletBalance;
  };

  const getBalanceStatus = () => {
    const purchaseAmount = getPurchaseAmount();
    const remainingBalance = walletBalance - purchaseAmount;

    if (purchaseAmount === 0) return null;

    return {
      hasSufficient: hasSufficientBalance(),
      remaining: remainingBalance,
      shortfall: purchaseAmount - walletBalance,
    };
  };

  const balanceStatus = getBalanceStatus();

  const renderInternetService = () => {
    const selectedPlanDetails = getSelectedPlanDetails();

    return (
      <div className="space-y-6">
        {/* Wallet Balance Display */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaWallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Wallet Balance:
              </span>
            </div>
            <span className="text-lg font-bold text-blue-800">
              ₵{walletBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="network"
              className="block text-sm font-medium text-gray-700"
            >
              Select Network
            </label>
            <select
              id="network"
              value={selectedNetwork}
              onChange={(e) => {
                setSelectedNetwork(e.target.value);
                setSelectedPlan("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="">Choose network</option>
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number *
            </label>
            <input
              id="mobile"
              type="tel"
              placeholder="0241234567"
              value={mobileNumber}
              onChange={(e) => handleMobileNumberChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.mobileNumber ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={10}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
            <p className="text-gray-500 text-xs">
              Enter 10-digit number starting with 0
            </p>
          </div>
        </div>

        {selectedNetwork && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="dataPlan"
                className="block text-sm font-medium text-gray-700"
              >
                Select Data Plan - {selectedNetwork}
              </label>
              <select
                id="dataPlan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Choose data plan</option>
                {networkPlans.internet[selectedNetwork]?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ₵{plan.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Plan Details */}
            {selectedPlanDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedPlanDetails.name}
                    </h4>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ₵{selectedPlanDetails.price}
                  </span>
                </div>

                {/* Balance Status */}
                {balanceStatus && (
                  <div
                    className={`mt-3 p-2 rounded text-sm ${
                      balanceStatus.hasSufficient
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {balanceStatus.hasSufficient
                      ? `After purchase: ₵${balanceStatus.remaining.toFixed(
                          2
                        )} remaining`
                      : `Insufficient balance! Need ₵${balanceStatus.shortfall.toFixed(
                          2
                        )} more`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSMSService = () => {
    const selectedPlanDetails = getSelectedPlanDetails();

    return (
      <div className="space-y-6">
        {/* Wallet Balance Display */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaWallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Wallet Balance:
              </span>
            </div>
            <span className="text-lg font-bold text-blue-800">
              ₵{walletBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="network"
              className="block text-sm font-medium text-gray-700"
            >
              Select Network
            </label>
            <select
              id="network"
              value={selectedNetwork}
              onChange={(e) => {
                setSelectedNetwork(e.target.value);
                setSelectedPlan("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="">Choose network</option>
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number *
            </label>
            <input
              id="mobile"
              type="tel"
              placeholder="0241234567"
              value={mobileNumber}
              onChange={(e) => handleMobileNumberChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.mobileNumber ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={10}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
            <p className="text-gray-500 text-xs">
              Enter 10-digit number starting with 0
            </p>
          </div>
        </div>

        {selectedNetwork && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="smsPlan"
                className="block text-sm font-medium text-gray-700"
              >
                Select SMS Bundle - {selectedNetwork}
              </label>
              <select
                id="smsPlan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Choose SMS bundle</option>
                {networkPlans.sms[selectedNetwork]?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ₵{plan.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Plan Details */}
            {selectedPlanDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedPlanDetails.name}
                    </h4>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ₵{selectedPlanDetails.price}
                  </span>
                </div>

                {/* Balance Status */}
                {balanceStatus && (
                  <div
                    className={`mt-3 p-2 rounded text-sm ${
                      balanceStatus.hasSufficient
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {balanceStatus.hasSufficient
                      ? `After purchase: ₵${balanceStatus.remaining.toFixed(
                          2
                        )} remaining`
                      : `Insufficient balance! Need ₵${balanceStatus.shortfall.toFixed(
                          2
                        )} more`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderElectricityService = () => {
    const purchaseAmount = getPurchaseAmount();
    const balanceStatus = purchaseAmount > 0 ? getBalanceStatus() : null;

    return (
      <div className="space-y-6">
        {/* Wallet Balance Display */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaWallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Wallet Balance:
              </span>
            </div>
            <span className="text-lg font-bold text-blue-800">
              ₵{walletBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Electricity Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                electricityType === "prepaid"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setElectricityType("prepaid")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    electricityType === "prepaid"
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                ></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Prepaid</h4>
                  <p className="text-sm text-gray-600">
                    Pay for electricity credits
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                electricityType === "postpaid"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setElectricityType("postpaid")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    electricityType === "postpaid"
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                ></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Postpaid</h4>
                  <p className="text-sm text-gray-600">Pay electricity bills</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {electricityType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="meter"
                className="block text-sm font-medium text-gray-700"
              >
                Meter Number
              </label>
              <input
                id="meter"
                type="text"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (₵)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        )}

        {/* Balance Status for Electricity */}
        {balanceStatus && (
          <div
            className={`p-3 rounded-lg border ${
              balanceStatus.hasSufficient
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`text-sm font-medium ${
                balanceStatus.hasSufficient ? "text-green-800" : "text-red-800"
              }`}
            >
              {balanceStatus.hasSufficient
                ? `After purchase: ₵${balanceStatus.remaining.toFixed(
                    2
                  )} remaining`
                : `Insufficient balance! Need ₵${balanceStatus.shortfall.toFixed(
                    2
                  )} more`}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case "internet":
        return <FaMobile className="w-6 h-6 text-blue-600" />;
      case "sms":
        return <FaComment className="w-6 h-6 text-purple-600" />;
      case "electricity":
        return <FaBolt className="w-6 h-6 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getServiceTitle = () => {
    switch (serviceType) {
      case "internet":
        return "Internet Data Bundles";
      case "sms":
        return "SMS Bundles";
      case "electricity":
        return "Electricity Bill Payment";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-lg backdrop-saturate-150 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getServiceIcon()}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {getServiceTitle()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {serviceType === "electricity"
                  ? "Pay your electricity bills quickly and securely"
                  : `Purchase ${serviceType} bundles for any network`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {serviceType === "internet" && renderInternetService()}
          {serviceType === "sms" && renderSMSService()}
          {serviceType === "electricity" && renderElectricityService()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-lg font-semibold text-gray-900">
            Total: ₵{getPurchaseAmount().toFixed(2)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={
                !isFormValid() || !hasSufficientBalance() || isProcessing
              }
              className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Buy Now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
