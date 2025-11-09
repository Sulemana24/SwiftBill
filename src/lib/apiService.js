// lib/apiService.js
export async function initiateTransaction({
  network,
  number,
  reference,
  dataPackage,
}) {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      network,
      number,
      reference,
      package: dataPackage,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Transaction failed");
  }

  return json;
}
