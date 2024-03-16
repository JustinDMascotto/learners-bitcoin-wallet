import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home'
import ImportKeys from './pages/import-keys/import-keys';
import { IMPORT_KEYS } from './pages/constants';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path={`/${IMPORT_KEYS}`} element={<ImportKeys/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
