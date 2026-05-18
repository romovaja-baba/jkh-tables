import { createContext, useContext } from 'react';
import { rootStore } from '../models/RootStore';

export const RootStoreContext = createContext(rootStore);
export const useRootStore = () => useContext(RootStoreContext);
