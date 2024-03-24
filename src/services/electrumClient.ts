import * as bitcoin from 'bitcoinjs-lib'
import axios from 'axios'

const hostAddress = "localhost"
const port = 3001

// Function to create a JSON-RPC 2.0 request
function createBody(method: string, params: any[] = [], id: number = 1) {
  return {
    jsonrpc: "2.0",
    id,
    method,
    params,
  };
}

// would need a websocket compatible endpoint for this to work
// export async function testConnection() : Promise<any> {
//     return new Promise((resolve,reject) => {
//         // Connect to an Electrum server via WebSocket

//         const ws = new WebSocket(`http://${hostAddress}:${port}/send-request`);
//         ws.onopen = () => {
//             console.log('Connected to Electrum server');
//             ws.send(JSON.stringify(createBody('server.ping')));
//         }
//         ws.onmessage = (event) => {
//             console.log('message from server', event.data);
//             resolve(event.data)
//         }
//         ws.onerror = (event) => {
//             console.error('Websocket error:', event);
//             reject(event)
//         }
//         ws.onclose = () => {
//             console.log('Websocket connection closed');
//         }
//     });
// }

// supports both bech32 and base58 address formats
export async function getUtxos(address:string,network:bitcoin.networks.Network):Promise<ListUnspentResponseElement[]> {
    const scriptPubKey = bitcoin.address.toOutputScript(address!,network);
    const hash = bitcoin.crypto.sha256(scriptPubKey).reverse().toString('hex');
    const response = await sendRequestAxios('blockchain.scripthash.listunspent',[hash]);
    return response.data.result
}

export interface ListUnspentResponseElement {
    height: number
    tx_hash: string
    tx_pos: number
    value: number
}

// Send request with mode: 'no-cors' removes the body of the post request 
export async function sendRequest(method:string,params?:any[]): Promise<Response> {
    const body = JSON.stringify(createBody(method,params));
    console.log(body)
    return await fetch(`http://${hostAddress}:${port}/send-request`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body
    });
}

export async function sendRequestAxios(method:string,params?:any[]):Promise<any> {
    try {
      const data = createBody(method, params);
      console.log(JSON.stringify(data));
      
      const response = await axios.post(`http://${hostAddress}:${port}/send-request`, data);
      return response; // The caller will need to use response.data to access the returned data
    } catch (error) {
      console.error('Request failed:', error);
      throw error; // Or handle the error as needed
    }
  }