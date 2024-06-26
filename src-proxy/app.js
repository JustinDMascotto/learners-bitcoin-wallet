const express = require('express');
const net = require('net');
const cors = require('cors');
const app = express();
const PORT = 3001; // Port for the Express server

app.use(express.json());
app.use(cors())

const hostAddress = process.env.ELECTRS_HOST.split(':')[0]
const port = process.env.ELECTRS_HOST.split(':')[1]

app.post('/send-request', (req, res) => {
    const client = new net.Socket();
    
    client.connect(port, hostAddress, () => {
        const body = JSON.stringify(req.body)+'\n'
        console.log(`Proxying request to tcp server ${hostAddress}:${port} ${body}`);
        client.write(body);
    });

    client.on('data', (data) => {
        console.log('Received:', data.toString());
        res.send(data.toString());
        client.destroy(); // Close the connection after receiving the response
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
        res.status(500).send(err.message);
    });
});

app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));

module.exports = app
