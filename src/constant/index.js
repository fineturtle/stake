import Fine_VIP_ABI from "./finevip.json";
import Web3 from "web3";
import Staking_ABI from './staking.json'
import Swap_ABI from './swap.json'
import USDC_ABI from "./usdc.json";

export const PUBLIC_URL = "";

// BSC MAINNET
export const ADMIN_ACCOUNT1 = "";
export const ADMIN_ACCOUNT = "";

export const FINE_VIP_ADDRESS = "0x0516c2466756C87fF065b529be87e886F750e3eD";
export const USDC_ADDRESS = "0xa8A28c353dDF1A0E4eC50feCA6Dbc5Ad364Fe949";
export const USDT_ADDRESS = "0xd216F026aFdd5B854A7341e12CC71D651507B462";
export const STAKING_ADDRESS = "0x72fE0D0e97893Bcb982b361eD317e39c1BcE7f8D"
export const SWAP_ADDRESS = "0xbD02CB6Dc908A2D39c4471DD3aEbf7189CCbBD58"
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ALERT_EMPTY = "";
export const ALERT_SUCCESS = "success";
export const ALERT_WARN = "warning";
export const ALERT_ERROR = "error";

export const RPC_URL = "https://bsc-dataseed1.binance.org";
export const MAINNET = 1;
export const TESTNET = 5;
export const ETH_RPC = 'https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
export const TEST_RPC = 'https://goerli.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
export const INFURA_ID = '0e42c582d71b4ba5a8750f688fce07da'
export const ClaimPeriod = 300;
export const UnstakePeriod = 2100;

export const REF_PREFIX = `${PUBLIC_URL}/?ref=`;
export const CUSTOM_WEB3 = new Web3(new Web3.providers.HttpProvider(TEST_RPC))

export function getFineVipContract(web3) {
  return new web3.eth.Contract(Fine_VIP_ABI, FINE_VIP_ADDRESS);
}

export function getStakingContract(web3) {
  return new web3.eth.Contract(Staking_ABI, STAKING_ADDRESS);
}

export function getSwapContract(web3) {
  return new web3.eth.Contract(Swap_ABI, SWAP_ADDRESS);
}

export function getUSDCContract(web3) {
  return new web3.eth.Contract(USDC_ABI, USDC_ADDRESS);
}

export function getUSDTContract(web3) {
  return new web3.eth.Contract(USDC_ABI, USDT_ADDRESS);
}

