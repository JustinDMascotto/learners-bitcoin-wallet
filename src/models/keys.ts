import * as bip32Int from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';

const ecc: bip32Int.TinySecp256k1Interface = require('@bitcoinerlab/secp256k1');
const bip32 = BIP32Factory(ecc);

export class Keys {
    network: bitcoin.Network;
    hdRoot: bip32Int.BIP32Interface;

    constructor(hdRoot: bip32Int.BIP32Interface, network: bitcoin.Network) {
        this.hdRoot = hdRoot;
        this.network = network;
    }

    toString(): string {
        return this.hdRoot.publicKey.toString('hex')
    }

    static importFromXpriv(xprivBase58: string, network: bitcoin.Network) : Keys {
        return new Keys(bip32.fromBase58(xprivBase58,network),network);
    }

    static importFromMnemonic(mnemonic:string,network:bitcoin.Network) : Keys {
        bip39.validateMnemonic(mnemonic);
        let seed = bip39.mnemonicToSeedSync(mnemonic);
        return this.importFromSeed(seed,network);
    }

    static importFromHex(hex:string,network:bitcoin.Network) : Keys {
        return this.importFromSeed(Buffer.from(hex,'hex'),network);
    }

    static importBrainWallet(secret:string,network:bitcoin.Network) : Keys {
        let buffer = Buffer.from(secret,'utf8');
        return this.importFromSeed(buffer,network);
    }

    private static importFromSeed(seed:Buffer,network:bitcoin.Network):Keys {
        return new Keys(bip32.fromSeed(seed,network),network);
    }
}