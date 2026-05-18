import { types } from 'mobx-state-tree';

export const AreaModel = types.model('Area', {
  id: types.identifier,
  street: types.string,
  building: types.string,
  apartment: types.string,
});
