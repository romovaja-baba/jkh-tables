import { useState, useEffect, useCallback } from 'react';
import { fetchMeters, deleteMeter, type Meter } from '../api/metersApi';

interface MetersResponse {
  results: Meter[];
  count: number;
}

export const useMetersPage = (offset: number, limit = 20) => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data: MetersResponse = await fetchMeters(offset, limit);
        if (!cancelled) {
          setMeters(data.results ?? []);
          setTotal(data.count ?? 0);
        }
      } catch {
        if (!cancelled) {
          setIsError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [offset, limit]);

  const handleDeleteMeter = useCallback(
    async (meterId: string) => {
      try {
        await deleteMeter(meterId);
        const data: MetersResponse = await fetchMeters(offset, limit);
        setMeters(data.results ?? []);
        setTotal(data.count ?? 0);
      } catch {
        console.log('error');
      }
    },
    [offset, limit]
  );

  return {
    meters,
    total,
    isLoading,
    isError,
    deleteMeter: handleDeleteMeter,
  };
};
