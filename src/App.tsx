import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home'
import PrivateKeysFromBook from './pages/private-keys/private-keys-from-book';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/private-keys" element={<PrivateKeysFromBook/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
