export const FASTY_API_URL = "https://fastydata.com/api_init";
export const FASTY_API_HISTORY_URL = "https://fastydata.com/api_req";

const API_KEY = process.env.NEXT_PUBLIC_FASTY_API_KEY;

export async function initiateTransaction({
  network,
  number,
  reference,
  packageValue,
}) {
  try {
    const response = await fetch(FASTY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network,
        number,
        reference,
        package: packageValue,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Unable to complete transaction");
  }
}

export async function getTransactionHistory({ network, reference }) {
  const url = `${FASTY_API_HISTORY_URL}?network=${network}${
    reference ? `&reference=${reference}` : ""
  }`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API History Error:", error);
    throw new Error("Unable to fetch transaction history");
  }
}
