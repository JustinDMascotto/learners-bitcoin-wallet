import * as bitcoin from 'bitcoinjs-lib'
import { Keys } from "../models/keys";

export function getAddressP2PKH(node: any, network?: any): string {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
  }

export function getAddressP2WPKH(node: any, network?: any): string {
    return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network}).address!
}

export function isBech32Format(address:string):boolean {
    // mainnet vs testnet
    return address.startsWith("bc1") || address.startsWith("tb1")
}

export function getAddressesForAccount(account:number,
                                       keys: Keys): Address[] {
    let addresses: Address[] = [];
    for(let i = 0; i < 10; i++) {
        const accountKeys = keys.hdRoot.deriveHardened(account)
        const childAddrExternal = accountKeys.derive(0)
        const childAddrInternal = accountKeys.derive(1)
        addresses.push({
            externalPubAddress: getAddressP2PKH(childAddrExternal?.derive(i),keys!.network),
            internalPubAddress: getAddressP2PKH(childAddrInternal?.derive(i),keys!.network),
        })
    }
    return addresses;
}

export interface Address {
    externalPubAddress: string,
    internalPubAddress: string,
}