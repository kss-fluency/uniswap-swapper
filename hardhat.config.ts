import { HardhatUserConfig } from "hardhat/config";
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import * as dotenv from 'dotenv';
import {env} from "process";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: env.SEPOLIA_RPC_URL || '',
      chainId: 11155111,
      accounts: !!env.SEPOLIA_WALLET_PRIVATE_KEY ? [env.SEPOLIA_WALLET_PRIVATE_KEY] : []
    },
  },
  etherscan: {
    apiKey: {
      sepolia: env.SEPOLIA_ETHERSCAN_API_KEY || ''
    }
  }
};

export default config;
