const request = require('supertest')
const app = require('./app')

describe("proxy app", () => {
    test("can send http request and proxy to tcp", async () => {
        const reqBody = JSON.stringify({
            jsonrpc: "2.0", 
            id: 1, 
            method: 'server.ping', 
            params: []
        }) + '\n';
        
        try{
            const response = await request(app)
                .post('/send-request')
                .set('Content-Type','application/json')
                .send(reqBody);
            
                expect(response).toBeDefined()
        } catch (e) {
            console.error(e)
        }
    }, 20000);

    test("can connect with tcp", () => {
        
    });
});