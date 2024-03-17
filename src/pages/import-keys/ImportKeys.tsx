import { useState } from 'react';
import SidePanel from '../../components/SidePanel';
import { useAppState } from '../../components/AppState';
import { Keys } from '../../models/keys';
import * as networks from 'bitcoinjs-lib/src/networks';

const ImportKeys = () => {
  // State to hold the input value
  const { state, dispatch } = useAppState();

  const [activeTab, setActiveTab] = useState('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [hex, setHex] = useState('');
  const [xpriv, setXpriv] = useState('');

  // // useEffect(() => {
  // //   const processedValue = process(inputValue);
  // //   setOutputValue(processedValue);
  // // },[inputValue])

  const importMnemonic = () => {
    let keys = Keys.importFromMnemonic(mnemonic, networks.testnet);
    dispatchImport(keys);
  }

  const importHex = () => {
    let keys = Keys.importFromHex(hex, networks.testnet);
    dispatchImport(keys);
  }

  const importXpriv = () => {
    let keys = Keys.importFromXpriv(xpriv, networks.testnet);
    dispatchImport(keys);
  }

  function dispatchImport(keys:Keys){
    dispatch({type: 'IMPORT', keys: keys });
  }

  return (
    <div>
        <SidePanel></SidePanel>
        <div>
          <div>
            <button onClick={() => setActiveTab('mnemonic')}>Import Mnemonic</button>
            <button onClick={() => setActiveTab('hex')}>Import Hex</button>
            <button onClick={() => setActiveTab('xpriv')}>Import Xpriv</button>
          </div>
          {activeTab === 'mnemonic' && (
            <div>
              <input
                type="text"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
              />
              <button onClick={importMnemonic}>Import</button>
            </div>
          )}
          {activeTab === 'hex' && (
            <div>
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
              />
              <button onClick={importHex}>Import</button>
            </div>
          )}
          {activeTab === 'xpriv' && (
            <div>
              <input
                type="text"
                value={xpriv}
                onChange={(e) => setXpriv(e.target.value)}
              />
              <button onClick={importXpriv}>Import</button>
            </div>
          )}
      </div>
      {state.keys != undefined && (
        <div>
          Your private key has been imported! Public key hex: {state.keys.toString()}
        </div>
      )}
    </div>
  );
};

export default ImportKeys;