import { types } from 'mobx-state-tree';

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
