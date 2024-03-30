export type NetworkKey = 'MAINNET' | 'TESTNET' | 'REGTEST'

export class Settings {
    network: NetworkKey
    addressType: WalletAddressType
    electrsProxyHost: string

    constructor(network:NetworkKey,
                addressType:WalletAddressType,
                electrsProxyHost:string){
        this.network = network
        this.addressType = addressType
        this.electrsProxyHost = electrsProxyHost
    }
}

// which address types are supported
export enum WalletAddressType{
    P2PK = 'P2PK',
    P2PKH = 'P2PKH',
    P2SH = 'P2SH',
    P2WPKH = 'P2WPKH',
    P2WSH = 'P2WSH',
    P2TR = 'P2TR'
}