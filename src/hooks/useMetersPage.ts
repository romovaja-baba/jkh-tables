import { useState, useEffect, useCallback } from 'react';
import { fetchMeters, deleteMeter, type Meter } from '../api/metersApi';
import { fetchAreas } from '../api/areasApi';
import { useRootStore } from '../context/RootStoreContext';

interface MetersResponse {
  results: Meter[];
  count: number;
}

export const useMetersPage = (offset: number, limit = 20) => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data: MetersResponse = await fetchMeters(offset, limit);
        if (cancelled) return;

        const newMeters = data.results ?? [];
        setMeters(newMeters);
        setTotal(data.count ?? 0);

        const areaIds = newMeters.map((m) => m.area.id);
        const missingIds = rootStore.getMissingAreaIds(areaIds);
        if (missingIds.length > 0) {
          try {
            const areas = await fetchAreas(missingIds);
            if (!cancelled) {
              rootStore.addAreas(areas);
            }
          } catch {
            // Area fetch failed, addresses will show "Загрузка..."
          }
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
  }, [offset, limit, rootStore]);

  const handleDeleteMeter = useCallback(
    async (meterId: string) => {
      try {
        await deleteMeter(meterId);
        const data: MetersResponse = await fetchMeters(offset, limit);
        const newMeters = data.results ?? [];
        setMeters(newMeters);
        setTotal(data.count ?? 0);

        const areaIds = newMeters.map((m) => m.area.id);
        const missingIds = rootStore.getMissingAreaIds(areaIds);
        if (missingIds.length > 0) {
          try {
            const areas = await fetchAreas(missingIds);
            rootStore.addAreas(areas);
          } catch {
            // silent
          }
        }
      } catch {
        console.log('error');
      }
    },
    [offset, limit, rootStore]
  );

  return {
    meters,
    total,
    isLoading,
    isError,
    deleteMeter: handleDeleteMeter,
  };
};
