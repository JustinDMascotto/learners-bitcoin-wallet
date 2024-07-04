import * as bitcoin from 'bitcoinjs-lib'
import axios from 'axios'
import { Tx } from './model/raw-transaction';

// supports both bech32 and base58 address formats
export async function getUtxos(address:string,network:bitcoin.networks.Network,electrsProxyHost:string):Promise<ListUnspentResponseElement[]> {
    const scriptPubKey = bitcoin.address.toOutputScript(address!,network);
    const hash = bitcoin.crypto.sha256(scriptPubKey).reverse().toString('hex');
    const response = await sendRequestAxios(electrsProxyHost,'blockchain.scripthash.listunspent',[hash]);
    return response.data.result;
}

export interface ListUnspentResponseElement {
    height: number
    tx_hash: string
    tx_pos: number
    value: number
}

export async function getRawTransaction(transactionId:string,electrsProxyHost:string):Promise<Tx> {
  const response = await sendRequestAxios(electrsProxyHost,"blockchain.transaction.get",[transactionId,true]);
  return response.data.result as Tx;
}


// Send request with mode: 'no-cors' removes the body of the post request 
export async function sendRequest(electrsProxyHost:string,method:string,params?:any[]): Promise<Response> {
    const body = JSON.stringify(createBody(method,params));
    console.log(body)
    return await fetch(`${electrsProxyHost}/send-request`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body
    });
}

export async function sendRequestAxios(electrsProxyHost:string,method:string,params?:any[]):Promise<any> {
    // could move getSettings call somewhere so its not loaded every call but just when settings change
    
    try {
      const data = createBody(method, params);
      console.log(JSON.stringify(data));
      
      const response = await axios.post(`${electrsProxyHost}/send-request`, data);
      console.log(response.data)
      return response; // The caller will need to use response.data to access the returned data
    } catch (error) {
      console.error('Request failed:', error);
      throw error; // Or handle the error as needed
    }
  }

  // Function to create a JSON-RPC 2.0 request
function createBody(method: string, params: any[] = [], id: number = 1) {
  return {
    jsonrpc: "2.0",
    id,
    method,
    params,
  };
}