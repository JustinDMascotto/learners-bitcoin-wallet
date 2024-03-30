import { Settings, WalletAddressType } from "../../models/settings";

export const getSettings = ():Settings => {
    const settings = localStorage.getItem('settings');
    console.log(`Loading settings: ${settings}`)
    if(settings !== null && settings !== undefined && settings !== 'undefined'){
        return JSON.parse(settings)
    } else {
        return new Settings('MAINNET',WalletAddressType.P2PKH,'');
    }
}