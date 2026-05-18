export interface Meter {
  id: string;
  _type: 'ColdWaterAreaMeter' | 'HotWaterAreaMeter';
  installation_date: string;
  is_automatic: boolean;
  initial_values: number[];
  area: { id: string };
  description: string;
}

export const fetchMeters = async (offset: number, limit = 20) => {
  const res = await fetch(`/api/meters/?limit=${limit}&offset=${offset}`);
  return res.json();
};

export const deleteMeter = async (meterId: string) => {
  await fetch(`/api/meters/${meterId}/`, { method: 'DELETE' });
};
