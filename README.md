# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



Setting up Regtest docker environment
1. docker compose up the contaienrs
1. create a wallet ```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass createwallet "mywallet"```
    load wallet ```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass loadwallet "mywallet"```
1. generate some blocks ```docker exec -it learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass -generate 101```


# Other helpful commands
1. list wallets
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass listwallets```
1. Import private keys (false tells it not to scan the blockchain for utxos) into the wallet specified
```docker exec -it learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass importprivkey "cNGWP57ZDWFDfFdthpBAf5dsm927tqdZ89dePh6Mgzn6Di1vj2Gu" "mywallet" false```
1. dump private key of address
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass dumpprivkey "bcrt1qlu23tu7rpy7qxg8r4c97cp0v58qkxx6zgyhdw6"```
1. get network info
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass getnetworkinfo```
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass getblockchaininfo```
1. list received addresses (minimum number of confirmations, include addresses that havent received funds)
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass listreceivedbyaddress 0 true```
1. get balance
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass getbalance```
1. generate to address
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass generatetoaddress 10 2N7bYH986fxWUB4LovPWsMHnXAkh5vgGuB6```
1. send to address 
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass sendtoaddress mvHrxjbGSjmM4gan8sGfsnqxFQXSBWk8p6 0.234```
1. get transaction by id
```docker exec learners-bitcoin-wallet-bitcoind-1 bitcoin-cli -regtest -rpcuser=user -rpcpassword=pass getrawtransaction 52cb5820911ff16d8eb51a5ab3f7476d8716f9afd8293c02cbb17f0e1a654bd5 true```

# Self notes
To pick up 
1. load wallet with load wallet command above
1. your funds are at path m/0'/0/0
1. possibly need to generate some blocks for elects to "wake up"
