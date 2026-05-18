import { MetersPage } from './pages/MetersPage';
import { RootStoreContext } from './context/RootStoreContext';
import { rootStore } from './models/RootStore';
import { GlobalStyles } from './styles/GlobalStyles';

const App = () => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      <GlobalStyles />
      <MetersPage />
    </RootStoreContext.Provider>
  );
};

export default App;
