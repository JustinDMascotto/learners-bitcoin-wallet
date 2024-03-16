import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as crypto from 'crypto';
import * as bs58check from 'bs58check';
import ecc from '@bitcoinerlab/secp256k1';

const bip32utils = require('bip32-utils')


const bip32 = BIP32Factory(ecc);

const getBitcoinAddress = (publicKey:Buffer) => {
    // Step 1: Public Key Hash (SHA-256 followed by RIPEMD-160)
    const sha256 = crypto.createHash('sha256').update(publicKey).digest();
    const ripemd160 = crypto.createHash('ripemd160').update(sha256).digest();

    // Step 2: Add Network Byte (0x00 for Bitcoin Mainnet)
    const networkByte = Buffer.alloc(1, 0x00);
    const extendedRipemd160 = Buffer.concat([networkByte, ripemd160]);

    // Step 3: Base58Check Encode
    const address = bs58check.encode(extendedRipemd160);

    return address;
}

test("Test creating an account from a mnematic phrase", () => {
    let mnemonic = bip39.generateMnemonic();
    let seed = bip39.mnemonicToSeedSync(mnemonic);
    
    let hdNode =  bip32.fromSeed(seed);
    // let childNode = hdNode.deriveHardened(0)
    // let external = childNode.derive(0)
    // let internal = childNode.derive(1)

    let external = hdNode.derivePath("m/44'/0'/0'/0");
    let internal = hdNode.derivePath("m/44'/0'/0'/1");


    let account = new bip32utils.Account([
        new bip32utils.Chain(external.neutered()),
        new bip32utils.Chain(internal.neutered())
    ]);
    console.log(account);
    
    let internalPubKey = getBitcoinAddress(internal.publicKey)
    let externalPubKey = getBitcoinAddress(external.publicKey)

    console.log(internalPubKey)
    // => 1DAi282VN7Ack9o5BqWYkiEsS8Vgx1rLn

    console.log(externalPubKey)
    // => 1CXKM323V3kkrHmZQYPUTftGh9VrAWuAYX

    console.log(account.derive('1QEj2WQD9vxTzsGEvnmLpvzeLVrpzyKkGt'))
    // => xpub6A5Fz4JZg4kd8pLTTaMBKsvVgzRBrvai6ChoxWNTtYQ3UDVG1VyAWQqi6SNqkpsfsx9F8pRqwtKUbU4j4gqpuN2gpgQs4DiJxsJQvTjdzfA

    // NOTE: passing in the parent nodes allows for private key escalation (see xprv vs xpub)

    console.log(account.derive('1QEj2WQD9vxTzsGEvnmLpvzeLVrpzyKkGt', [external, internal]))
    // => xprv9vodQPEygdPGUWeKUVNd6M2N533PvEYP21tYxznauyhrYBBCmdKxRJzmnsTsSNqfTJPrDF98GbLCm6xRnjceZ238Qkf5GQGHk79CrFqtG4d
});



// m / 44' / 0' / 0' / 0 / 0
// 44': Indicates the use of BIP44.
// 0': Specifies Bitcoin as the cryptocurrency.
// 0': The first account (wallets can have multiple accounts).
// 0: External address (used for receiving funds).
// 0: The first address in this account and chain.