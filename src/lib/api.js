const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = {
  // Auth
  register: (userData) =>
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }).then((res) => res.json()),

  login: (credentials) =>
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then((res) => res.json()),

  // Transactions
  getTransactions: (token) =>
    fetch(`${API_URL}/transactions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json()),

  purchase: (purchaseData, token) =>
    fetch(`${API_URL}/transactions/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(purchaseData),
    }).then((res) => res.json()),

  topUp: (topUpData, token) =>
    fetch(`${API_URL}/transactions/topup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(topUpData),
    }).then((res) => res.json()),
};
