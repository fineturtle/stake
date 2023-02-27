import Web3 from "web3";
import Fine_VIP_ABI from "./finevip.json";
import Staking_ABI from './staking.json'
import Swap_ABI from './swap.json'
import USDC_ABI from "./usdc.json";

export const PUBLIC_URL = "";

export const FINE_VIP_ADDRESS = "0x129DA90eee0762A6B021F2fdC924abF89b68D167";
export const STAKING_ADDRESS = "0x30cdCd5b6E0543A0D4c57e4358623A9aBAECC87f";
export const SWAP_ADDRESS = "0x321bd7055A0dfb4BB93f59160F058d2e1C549096";
export const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const RPC_URL = "https://bsc-dataseed1.binance.org";
export const MAINNET = 1;
export const POlYGON = 137;
export const TESTNET = 5;
export const ETH_RPC = 'https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
export const TEST_RPC = 'https://goerli.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
export const INFURA_ID = '0e42c582d71b4ba5a8750f688fce07da'
export const POLYGON_RPC = 'https://polygon-mainnet.g.alchemy.com/v2/VpFh3Em61JlDlW7gZvNWtMd9px44s5KN';
export const ClaimPeriod = 86400;
export const UnstakePeriod = 259200;

export const REF_PREFIX = `${PUBLIC_URL}/?ref=`;
export const CUSTOM_WEB3 = new Web3(new Web3.providers.HttpProvider(POLYGON_RPC))

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
