import dotenv from "dotenv";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ETH_RPC, TEST_RPC, MAINNET, INFURA_ID } from "../constant";
dotenv.config();

/**
  Web3 modal helps us "connect" external wallets:
**/
const web3ModalSetup = () =>
  new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID, // required
          rpc: {
            [MAINNET]: ETH_RPC
          },
        },
      },
    },
  });

export default web3ModalSetup;
