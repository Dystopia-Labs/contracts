import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";

export default {
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad",
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : "remote",
    },
    xDai: {
      url: "https://rpc.xdaichain.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : "remote",
    },
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    version: "0.8.9",
  },
} as HardhatUserConfig;
