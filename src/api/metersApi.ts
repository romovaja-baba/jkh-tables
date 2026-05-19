import type { AreaMeterCategory } from '../models/Area';
import { BASE_URL } from './constant';

export interface Meter {
  id: string;
  _type: [AreaMeterCategory, string];
  installation_date: string;
  is_automatic: boolean;
  initial_values: number[];
  area: { id: string };
  description: string;
}

export const fetchMeters = async (offset: number, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/meters/?limit=${limit}&offset=${offset}`
  );
  return res.json();
};

export const deleteMeter = async (meterId: string) => {
  await fetch(`${BASE_URL}/meters/${meterId}/`, {
    method: 'DELETE',
  });
};
