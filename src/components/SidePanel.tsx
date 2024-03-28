import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMPORT_KEYS, WALLET } from '../pages/constants';

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Menu'}
      </button>
      {isOpen && (
        <div style={{ width: '250px', background: 'lightgrey', position: 'absolute', height: '100%' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to={`/${IMPORT_KEYS}`} onClick={() => setIsOpen(false)}>Import Keys</Link></li>
            <li><Link to={`/${WALLET}`} onClick={() => setIsOpen(false)}>Wallet</Link></li>
            {/* Add more links as needed */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidePanel;