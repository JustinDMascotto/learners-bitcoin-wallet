import * as bitcoin from 'bitcoinjs-lib'
import { AppStateProvider, useAppState } from '../../components/AppState'
import {useEffect,useState} from 'react'
import SidePanel from '../../components/SidePanel'
import { WalletAddressType, NetworkKey } from '../../models/settings'
import { getSettings } from './settingsUtil'

export const SettingsUi = () => {


    const { state, dispatch } = useAppState();
    const [ settings, setSettings ] = useState(state.settings)

    const changeNetwork = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const network = event.target.value as NetworkKey;
        if (settings == undefined ){
            setSettings({...getSettings(),network})
        } else {
            setSettings({...settings,network});
        }
        
    };

    const changeAddressType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const addressType = WalletAddressType[event.target.value as keyof typeof WalletAddressType];
        if (settings == undefined ){
            setSettings({...getSettings(),addressType})
        } else {
            setSettings({...settings,addressType});
        }
        
    };

    const changeElectrsHost = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (settings == undefined ){
            setSettings({...getSettings(),electrsProxyHost:event.target.value})
        } else {
            setSettings({...settings,electrsProxyHost:event.target.value});
        }
    }

    const saveSettings = () => {
        const settingsStr = JSON.stringify(settings);
        console.log(`Saved settings: ${settingsStr}}`)
        localStorage.setItem('settings', settingsStr);
        dispatch({type: 'LOAD_SETTINGS',settings})
    }



    return (
        <div>
            <SidePanel></SidePanel>
            <div>
                Address Type: 
                <select value={settings?.addressType} onChange={changeAddressType}>
                {Object.entries(WalletAddressTypeProperties).map(([walletType, properties]) => (
                    <option key={walletType} value={walletType} disabled={!properties.supported}>
                        {properties.readableName}
                    </option>
                ))}
                </select>
            </div>
            <div>
                Network: 
                <select value={settings?.network} onChange={changeNetwork}>
                {Object.entries(Networks).map(([networkKey, properties]) => (
                    <option key={networkKey} value={networkKey} disabled={!properties.supported}>
                        {properties.readableName}
                    </option>
                ))}
                </select>
            </div>
            <div>
                <input
                type='text'
                value={settings?.electrsProxyHost}
                onChange={changeElectrsHost}
                ></input>
            </div>
            <button onClick={saveSettings}>Save Settings</button>
        </div>
    )
}

export const WalletAddressTypeProperties = {
    [WalletAddressType.P2PK]: {supported: false, readableName: 'P2PK'},
    [WalletAddressType.P2PKH]: {supported: true, readableName: 'P2PKH'},
    [WalletAddressType.P2SH]: {supported: false, readableName: 'P2SH'},
    [WalletAddressType.P2WPKH]: {supported: true, readableName: 'P2WPKH'},
    [WalletAddressType.P2TR]: {supported: false, readableName: 'P2TR'},
    [WalletAddressType.P2WSH]: {supported: false, readableName: 'P2WSH'}
}




interface NetworkProperties {
    network: bitcoin.Network;
    supported: boolean;
    readableName: string;
}

export const Networks: Record<NetworkKey,NetworkProperties> = {
    MAINNET: {
        network: bitcoin.networks.bitcoin,
        supported: true,
        readableName: 'Mainnet'
    },
    TESTNET: {
        network: bitcoin.networks.testnet,
        supported: true,
        readableName: 'Testnet'
    },
    REGTEST: {
        network: bitcoin.networks.testnet,
        supported: false,
        readableName: 'Regtest'
    }
}