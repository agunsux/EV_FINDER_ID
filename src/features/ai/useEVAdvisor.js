import { useState } from "react";

export function useEVAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const askEVAdvisor = async ({ vehicles, userQuery }) => {
    setLoading(true);

    try {
      const response = await fetch("/api/ev-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          vehicles: vehicles,
        }),
      });

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { askEVAdvisor, loading, result };
}
