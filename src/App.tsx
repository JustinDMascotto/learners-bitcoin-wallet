import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'
import ImportKeys from './pages/import-keys/ImportKeys';
import { HOME, IMPORT_KEYS, WALLET } from './pages/constants';
import { Wallet } from './pages/wallet/Wallet';
import { getSettings } from './pages/settings/Settings';
import { useEffect } from 'react'
import { useAppState } from './components/AppState';

function App() {

  const { state, dispatch } = useAppState();

  useEffect(() => {
    const settings = getSettings();
    dispatch({type:'LOAD_SETTINGS', settings})
  },[]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path={`/${HOME}`} element={<Home/>}></Route>
          <Route path={`/${IMPORT_KEYS}`} element={<ImportKeys/>}></Route>
          <Route path={`/${WALLET}`} element={<Wallet/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
