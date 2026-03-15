import { useState, useCallback, useEffect } from "react";
import { fetchOpportunities } from "@/lib/api";
import { Opportunity, Paging, FetchOpportunitiesParams } from "@/types/opportunity";

const DEFAULT_AUTO_REFRESH_MS = 30000;

export function useOpportunities(initialParams: FetchOpportunitiesParams = {}) {
  const [data, setData] = useState<Opportunity[]>([]);
  const [paging, setPaging] = useState<Paging | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { q, page, category, country, remoteType, paid, duration, sortBy } = initialParams;

  const fetchOpportunitiesData = useCallback(async (params: FetchOpportunitiesParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchOpportunities(params);
      setData(response.data);
      setPaging(response.paging);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch opportunities.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to refetch on initialParams change (e.g. search filters updated)
  useEffect(() => {
    fetchOpportunitiesData({ q, page, category, country, remoteType, paid, duration, sortBy });
  }, [
    q,
    page,
    category,
    country,
    remoteType,
    paid,
    duration,
    sortBy,
    fetchOpportunitiesData,
  ]);

  // Auto-refresh keeps the list aligned with backend updates (e.g. new opportunities).
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchOpportunitiesData({ q, page, category, country, remoteType, paid, duration, sortBy });
    }, DEFAULT_AUTO_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [
    q,
    page,
    category,
    country,
    remoteType,
    paid,
    duration,
    sortBy,
    fetchOpportunitiesData,
  ]);

  return {
    data,
    paging,
    loading,
    error,
    refetch: fetchOpportunitiesData,
  };
}
