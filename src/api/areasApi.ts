import { BASE_URL } from './constant';

export interface AreaHouse {
  address: string;
  id: string;
  fias_addrobjs: string[];
}

export interface Area {
  id: string;
  number: number;
  str_number: string;
  str_number_full: string;
  house: AreaHouse;
}

export const fetchAreas = async (ids: string[]): Promise<Area[]> => {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) return [];
  const params = new URLSearchParams();
  uniqueIds.forEach((id) => params.append('id__in', id));
  const res = await fetch(`${BASE_URL}/areas/?${params}`);
  if (!res.ok) throw new Error('Failed to fetch areas');
  const data = await res.json();
  return data.results ?? data;
};
