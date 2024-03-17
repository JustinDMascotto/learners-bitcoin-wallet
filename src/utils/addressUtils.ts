import * as bitcoin from 'bitcoinjs-lib'

export function getAddressP2PKH(node: any, network?: any): string {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
  }

export function getAddressP2WPKH(node: any, network?: any): string {
    return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network}).address!
}
 