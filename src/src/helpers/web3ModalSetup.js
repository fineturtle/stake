import WalletConnectProvider from "@walletconnect/web3-provider";
import dotenv from "dotenv";
import Web3Modal from "web3modal";
import { INFURA_ID, POlYGON, POLYGON_RPC } from "../constant";
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
            [POlYGON]: POLYGON_RPC
          },
        },
      },
    },
  });

export default web3ModalSetup;
