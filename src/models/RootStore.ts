import { types } from 'mobx-state-tree';
import { AreaModel } from './Area';

export const RootStore = types
  .model('RootStore', {
    areasMap: types.map(AreaModel),
  })
  .actions((self) => ({
    addAreas(
      areas: Array<{
        id: string;
        number: number;
        str_number: string;
        str_number_full: string;
        house: {
          address: string;
          id: string;
          fias_addrobjs: string[];
        };
      }>
    ) {
      areas.forEach((area) => {
        self.areasMap.put(area);
      });
    },
  }))
  .views((self) => ({
    getAreaById(id: string) {
      return self.areasMap.get(id);
    },
    getMissingAreaIds(ids: string[]) {
      return ids.filter((id) => !self.areasMap.has(id));
    },
  }));

export const rootStore = RootStore.create({});
