import { types, flow } from 'mobx-state-tree';
import { fetchAreas, type Area } from '../api/areasApi';

export enum AreaMeterCategory {
  ColdWaterAreaMeter = 'ColdWaterAreaMeter',
  HotWaterAreaMeter = 'HotWaterAreaMeter',
}

export const AreaModel = types.model('Area', {
  id: types.identifier,
  number: types.number,
  str_number: types.string,
  str_number_full: types.string,
  house: types.model({
    address: types.string,
    id: types.string,
    fias_addrobjs: types.array(types.string),
  }),
});

export const AreasStore = types
  .model('AreasStore', {
    areasMap: types.map(AreaModel),
  })
  .actions((self) => ({
    fetchAreasIfNeeded: flow(function* (ids: string[]) {
      const uniqueIds = [...new Set(ids)];
      const toFetch = uniqueIds.filter((id) => !self.areasMap.has(id));
      if (toFetch.length === 0) return;

      try {
        const areas: Area[] = yield fetchAreas(toFetch);
        areas.forEach((area) => self.areasMap.put(area));
      } catch (e) {
        console.error('Ошибка загрузки адресов', e);
      }
    }),
  }));
