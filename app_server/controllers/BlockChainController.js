/**
 * Require the credentials that you entered in the .env file
 */
require('dotenv').config()

const Web3 = require('web3')
const axios = require('axios')
const EthereumTx = require('ethereumjs-tx')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice


const testnet = "https://rinkeby.infura.io/v3/66f5470a5e6f41b0b4696e96643d1d31"

const web3 = new Web3( new Web3.providers.HttpProvider(testnet) )
web3.eth.defaultAccount = process.env.WALLET_ADDRESS

const amountToSend = 0.001

const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    }

    console.log("\r\n")
    log (`Current ETH Gas Prices (in GWEI):`.cyan)
    console.log("\r\n")
    log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
    log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
    log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
    console.log("\r\n")

    return prices
}

module.exports.makeTransaction = async (data, logsEnabled = false) => {
    let myBalanceWei = web3.eth.getBalance(web3.eth.defaultAccount).toNumber()
    let myBalance = web3.fromWei(myBalanceWei, 'ether')

    if(logsEnabled)
        log(`Your wallet balance is currently ${myBalance} ETH`.green)

    let nonce = web3.eth.getTransactionCount(web3.eth.defaultAccount)
    
    if(logsEnabled)
        log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)

    let gasPrices = await getCurrentGasPrices()

    let details = {
        "to": process.env.DESTINATION_WALLET_ADDRESS,
        "value": web3.toHex( web3.toWei(amountToSend, 'ether') ),
        "gas": 210000,
        "gasPrice": gasPrices.high * 1000000000, // converts the gwei price to wei
        "nonce": nonce,
        "data": data,
        "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
    }

    const transaction = new EthereumTx(details)

    transaction.sign( Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex') )

    const serializedTransaction = transaction.serialize()

    const transactionId = web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex') )

    const url = `https://rinkeby.etherscan.io/tx/${transactionId}`
    if(logsEnabled)
        log(url.cyan)

    if(logsEnabled)
        log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta)

    //process.exit()
    return transactionId
}