import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
            <li><Link to="/private-keys" onClick={() => setIsOpen(false)}>Private Keys</Link></li>
            {/* Add more links as needed */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidePanel;