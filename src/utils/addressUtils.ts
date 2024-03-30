import * as bitcoin from 'bitcoinjs-lib'
import { Keys } from "../models/keys";
import { NetworkKey, WalletAddressType } from '../models/settings';
import { BIP32Interface } from 'bip32'

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
                                       addressScriptType:WalletAddressType,
                                       keys: Keys): Address[] {
    let addresses: Address[] = [];
    for(let i = 0; i < 10; i++) {
        const accountKeys = keys.hdRoot.deriveHardened(account);
        const childAddrExternal = accountKeys.derive(0);
        const childAddrInternal = accountKeys.derive(1);
        let scriptFunction: (node:BIP32Interface,network:bitcoin.Network) => string;
        switch(addressScriptType){
            case WalletAddressType.P2PKH: 
                scriptFunction = getAddressP2PKH;
                break;
            case WalletAddressType.P2WPKH:
                scriptFunction = getAddressP2WPKH;
                break;
            default:
                scriptFunction = getAddressP2PKH;
                break;
        }
        addresses.push({
            externalPubAddress: scriptFunction(childAddrExternal?.derive(i),keys!.network),
            internalPubAddress: scriptFunction(childAddrInternal?.derive(i),keys!.network),
        });
    }
    return addresses;
}

export interface Address {
    externalPubAddress: string,
    internalPubAddress: string,
}