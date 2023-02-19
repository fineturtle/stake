import Fine_VIP_ABI from "./finevip.json";
import Web3 from "web3";
import Staking_ABI from './staking.json'
import Swap_ABI from './swap.json'
import USDC_ABI from "./usdc.json";

export const PUBLIC_URL = "";

// BSC MAINNET
export const ADMIN_ACCOUNT1 = "";
export const ADMIN_ACCOUNT = "";

export const FINE_VIP_ADDRESS = "0xbd3576AccBd67F50A29bfF2f5258C286f1ab46dE";
export const USDC_ADDRESS = "0xE31A098De4bB163751cD1162c0092aDC02635A9a";
export const USDT_ADDRESS = "0x5200e01F6A89546512baD2E91552e67Affbc25c6";
export const STAKING_ADDRESS = "0xf18B8Aa992064Bb5f3664A0549EdA105Fd67C8a0"
export const SWAP_ADDRESS = "0x38353e3D5d41ecc4d036634Fd1e60A890a2C84De"
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ALERT_EMPTY = "";
export const ALERT_SUCCESS = "success";
export const ALERT_WARN = "warning";
export const ALERT_ERROR = "error";

export const RPC_URL = "https://bsc-dataseed1.binance.org";
export const MAINNET = 1;
export const TESTNET = 5;
export const ETH_RPC = 'https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
export const TEST_RPC = 'https://goerli.infura.io/v3/88b3ca144c6648df843909df0371ee08'
export const ALCHEMY = 'https://eth-goerli.g.alchemy.com/v2/-sCDx5P4vS9aaiK0PEJEys915K2M2l8j';
export const INFURA_ID = '0e42c582d71b4ba5a8750f688fce07da'
export const ClaimPeriod = 300;
export const UnstakePeriod = 2100;

export const REF_PREFIX = `${PUBLIC_URL}/?ref=`;
export const CUSTOM_WEB3 = new Web3(new Web3.providers.HttpProvider(TEST_RPC))

export const FineVipContract = new CUSTOM_WEB3.eth.Contract(Fine_VIP_ABI, FINE_VIP_ADDRESS);
export const StakingContract = new CUSTOM_WEB3.eth.Contract(Staking_ABI, STAKING_ADDRESS);
export const SwapContract = new CUSTOM_WEB3.eth.Contract(Swap_ABI, SWAP_ADDRESS);
export const USDCContract = new CUSTOM_WEB3.eth.Contract(USDC_ABI, USDC_ADDRESS);
export const USDTContract = new CUSTOM_WEB3.eth.Contract(USDC_ABI, USDT_ADDRESS);

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

