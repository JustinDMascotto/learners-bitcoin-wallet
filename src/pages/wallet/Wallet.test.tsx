const Client = require('bitcoin-core')
const client = new Client({
    network: 'mainnet',
    port: 8332,
    username: 'umbrel',
    password: 'D1kByh4NRtK03wL1Sdkosracu6ZLUC67N445jzoaRaE=',
    host: 'umbrel.local',
    ssl: false
});

const blockchainInfoCommand = {
    "jsonrpc": "1.0",
    "id": "curltext",
    "method": "getblockchaininfo",
    "params": []
}

describe("Accessing node", () => {

    test("Can we connect to node?", async () => {
        const info = await client.command("getblockchaininfo");

        console.log(info);

        expect(info).toBeDefined();
    });
});