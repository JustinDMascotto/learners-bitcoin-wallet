import { useState } from 'react';
import SidePanel from '../../components/SidePanel';
import { useAppState } from '../../components/AppState';
import { Keys } from '../../models/keys';
import * as networks from 'bitcoinjs-lib/src/networks';
import { DisplayKeys } from '../../components/DisplayKeys';
import { Networks } from '../../pages/settings/Settings'
import { NetworkKey } from '../../models/settings';

const ImportKeys = () => {
  // State to hold the input value
  const { state, dispatch } = useAppState();

  const [input, setInput] = useState('');
  const [ network ] = useState(Networks[ (state.settings?.network ?? 'MAINNET' ) as NetworkKey].network);

  const importMnemonic = (mnemonic:string) => {
    const keys = Keys.importFromMnemonic(mnemonic, network);
    dispatchImport(keys);
  }

  const importBrainWallet = (brainWallet:string) => {
    const keys = Keys.importBrainWallet(brainWallet, network);
    dispatchImport(keys);
  }

  const importHex = (hex:string) => {
    const keys = Keys.importFromHex(hex, network);
    dispatchImport(keys);
  }

  const importXpriv = (xpriv:string) => {
    const keys = Keys.importFromXpriv(xpriv, network);
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
            <button onClick={() => importMnemonic(input)}>Import Mnemonic</button>
            <button onClick={() => importHex(input)}>Import Hex</button>
            <button onClick={() => importXpriv(input)}>Import Xpriv</button>
            <button onClick={() => importBrainWallet(input)}>Import Brain Wallet</button>
          </div>
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
      </div>
      <DisplayKeys/>
    </div>
  );
};

export default ImportKeys;