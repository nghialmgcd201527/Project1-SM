require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BSC_TESTNET_PRIVATE_KEY = "bf9c70fc7c7587b625b89bb056b2057e5e133a8b5d00ede541c32a418ed02385";

module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      skipDryRun: true,
    },
    testnet: {
      provider: () => new HDWalletProvider(BSC_TESTNET_PRIVATE_KEY, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(process.env.BSC_MAINNET_PRIVATE_KEY, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: false,
        },
      }
    }
  },
};
