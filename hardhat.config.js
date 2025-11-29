require("@nomiclabs/hardhat-ethers");
// Load .env first, then override with .env.local if present
require("dotenv").config();
require("dotenv").config({ path: ".env.local", override: true });

const MONAD_URL = process.env.NEXT_PUBLIC_RPC_URL || "";
const RAW_ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
const ADMIN_KEY = RAW_ADMIN_KEY
  ? (RAW_ADMIN_KEY.startsWith("0x") ? RAW_ADMIN_KEY : `0x${RAW_ADMIN_KEY}`)
  : undefined;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    somnia_testnet: {
      url: "https://dream-rpc.somnia.network",
      chainId: 50312,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasLimit: 4500934,
    },
    monad_testnet: {
      url: MONAD_URL,
      accounts: ADMIN_KEY ? [ADMIN_KEY] : [],
    },
  },
};