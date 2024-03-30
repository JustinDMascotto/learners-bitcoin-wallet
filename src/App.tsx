import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home'
import ImportKeys from './pages/import-keys/ImportKeys';
import { HOME, IMPORT_KEYS, SETTINGS, WALLET } from './pages/constants';
import { Wallet } from './pages/wallet/Wallet';
import { SettingsUi } from './pages/settings/Settings';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path={`/${HOME}`} element={<Home/>}></Route>
          <Route path={`/${IMPORT_KEYS}`} element={<ImportKeys/>}></Route>
          <Route path={`/${WALLET}`} element={<Wallet/>}></Route>
          <Route path={`/${SETTINGS}`} element={<SettingsUi/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
