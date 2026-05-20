import { BASE_URL } from './constant';

export enum MeterCategory {
  ColdWaterAreaMeter = 'ColdWaterAreaMeter',
  HotWaterAreaMeter = 'HotWaterAreaMeter',
}

export const METER_TYPE_LABELS: Record<MeterCategory, string> = {
  [MeterCategory.ColdWaterAreaMeter]: 'ХВС',
  [MeterCategory.HotWaterAreaMeter]: 'ГВС',
};

export interface Meter {
  id: string;
  _type: [MeterCategory, string];
  installation_date: string;
  is_automatic: boolean;
  initial_values: number[];
  area: { id: string };
  description: string;
}

export const fetchMeters = async (
  offset: number,
  limit = 20
): Promise<{ results: Meter[]; count: number }> => {
  const res = await fetch(
    `${BASE_URL}/meters/?limit=${limit}&offset=${offset}`
  );
  return res.json();
};

export const deleteMeter = async (meterId: string): Promise<void> => {
  await fetch(`${BASE_URL}/meters/${meterId}/`, {
    method: 'DELETE',
  });
};
