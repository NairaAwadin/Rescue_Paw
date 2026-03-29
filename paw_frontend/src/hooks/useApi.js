import { useState, useEffect, useCallback } from "react";

export function useApi(apiFn, mockData = null, deps = []) {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!apiFn) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
    } catch (err) {
      console.warn("API fallback mock:", err.message);
      if (mockData) setData(mockData);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
