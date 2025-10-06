"use client";
import { useState } from "react";
import Toast from "./Toast";

// Custom hook for toast management
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (toast) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>
  );

  return { toasts, showToast, hideToast, ToastContainer };
};

export default useToast;
