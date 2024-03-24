import { Keys } from '../models/keys';
import { getAddressesForAccount } from '../utils/addressUtils';
import * as electurmClient from './electrumClient'
import * as bitcoin from 'bitcoinjs-lib'


describe("test electrum connection and api", () => {

    const keys = Keys.importFromHex('ddddddddddddddddddddddddddddddddddddddddddd',bitcoin.networks.testnet)
    test("send request", async () => {
        
        const external = keys.hdRoot.derivePath("m/44'/0'/0/0");

        const { address } = bitcoin.payments.p2pkh({pubkey:external.publicKey});
        const scriptPubKey = bitcoin.address.toOutputScript(address!);
        const hash = bitcoin.crypto.sha256(scriptPubKey).reverse().toString('hex');

        const response = await electurmClient.sendRequest('blockchain.scripthash.listunspent',[hash]);
        const obj = await response.json()
        expect(obj.result).toHaveLength(0);
    });

    test("get utxo for random addresses derived like in wallet", async () => {
        
        const addresses = getAddressesForAccount(1,keys);
        for(let addr of addresses){
            const response = await electurmClient.getUtxos(addr.externalPubAddress,keys.network);
            expect(response).toHaveLength(0);
        }  
        
    }, 10000 );

    test("get utxo from axios", async () => {
        
        const external = keys.hdRoot.derivePath("m/44'/0'/0/0");

        const { address } = bitcoin.payments.p2pkh({pubkey:external.publicKey});
        const scriptPubKey = bitcoin.address.toOutputScript(address!);
        const hash = bitcoin.crypto.sha256(scriptPubKey).reverse().toString('hex');

        const response = await electurmClient.sendRequestAxios('blockchain.scripthash.listunspent',[hash]);
    
        expect(response.data.result).toHaveLength(0);
    });

    // takes to long to run
    // test("get utxo for genesis block address", async () => {
    //     const address  = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    //     const response = await electurmClient.getUtxos(address);
    //     const obj = JSON.parse(response);
    // }, 2000000);

    test("test connection (fetch)", async () => {
        
        const promise = await electurmClient.sendRequest("server.ping");
        
        console.log(promise)
    });

    // test("test connection (websocket)", async () => {
        
    //     const promise = await electurmClient.testConnection();
        
    //     console.log(promise)
    // });
});