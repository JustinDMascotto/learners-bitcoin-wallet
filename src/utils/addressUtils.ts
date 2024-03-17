import * as bitcoin from 'bitcoinjs-lib'

export function getAddress(node: any, network?: any): string {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
  }
 