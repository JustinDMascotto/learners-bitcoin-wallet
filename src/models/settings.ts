export type NetworkKey = 'MAINNET' | 'TESTNET' | 'REGTEST'

export class Settings {
    network: NetworkKey
    addressType: WalletAddressType
    electrsProxyHost: string
    ammountDenomination: AmmountDenomination

    constructor(network:NetworkKey,
                addressType:WalletAddressType,
                electrsProxyHost:string,
                ammountDenomination:AmmountDenomination){
        this.network = network
        this.addressType = addressType
        this.electrsProxyHost = electrsProxyHost
        this.ammountDenomination = ammountDenomination
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

export enum AmmountDenomination{
    BTC = "BTC",
    SAT = "SAT"
}