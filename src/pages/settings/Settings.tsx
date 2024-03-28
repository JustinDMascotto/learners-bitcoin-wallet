import * as bitcoin from 'bitcoinjs-lib'

export const SettingsUi = () => {
    return (
        <div>

        </div>
    )
}

export const getSettings = ():Settings => {
    const settings = localStorage.getItem('settings');
    if(settings != null){
        return JSON.parse(settings)
    } else {
        return new Settings(bitcoin.networks.bitcoin,WalletAddressType.P2PKH);
    }
}

export class Settings {
    network: bitcoin.Network
    addressType: WalletAddressType

    constructor(network:bitcoin.Network,
                addressType:WalletAddressType){
        this.network = network
        this.addressType = addressType
    }
}

export enum WalletAddressType{
    P2PK,
    P2PKH,
    P2SH,
    P2WPKH,
    P2WSH,
    P2TR
}