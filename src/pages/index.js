import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Web3 from "web3";
import {
  ALERT_EMPTY, RPC_URL,
  ALERT_ERROR, ALERT_WARN, ClaimPeriod, CUSTOM_WEB3, getFineVipContract, getStakingContract,
  getSwapContract, getUSDCContract,
  getUSDTContract, STAKING_ADDRESS,
  SWAP_ADDRESS, TEST_RPC, ZERO_ADDRESS
} from "../constant";
import web3ModalSetup from "./../helpers/web3ModalSetup";

import BuyPanel from "../components/buy";
import LeftPanel from "../components/leftPanel";
import Spinner from "../components/loading/Spinner";
import StakePanel from "../components/stake";

import fine_vip from "../assets/fine_vip.png";
import menu from "../assets/menu.png";
import metamask from "../assets/metamask.png";
import usdc from "../assets/usdc.png";
import usdt from "../assets/usdt.png";
import walletIco from "../assets/wallet.png";

import { setWallet } from "../app/reducers/walletReducer";

const web3Modal = web3ModalSetup();

const httpProvider = new Web3.providers.HttpProvider(RPC_URL);
const web3NoAccount = new Web3(httpProvider);
const isAddress = web3NoAccount.utils.isAddress;
const contractNoAccount = getFineVipContract(web3NoAccount);

const Home = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fineVipContract, setFineVipContract] = useState();
  const [usdcContract, setUsdcContract] = useState();
  const [usdtContract, setUsdtContract] = useState();
  const [fineContract, setFineContract] = useState();
  const [stakingContract, setStakingContract] = useState();
  const [swapContract, setSwapContract] = useState();

  const [web3, setWeb3] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();
  const [curAcount, setCurAcount] = useState(null);
  const [walletBalances, setWalletBalances] = useState([0, 0, 0])
  const [stakingHistory, setStakingHistory] = useState([]);
  const [stakedBalance, setStakedBalance] = useState()
  const [availableRewards, setAvailableRewards] = useState(0);
  const [soldFineAmount, setSoldFineAmount] = useState(0)
  const [referralAmount, setReferralAmount] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)
  const [claimAmount, setClaimAmount] = useState(0)
  const [currentPage, setCurrentPage] = useState("");
  const [commission, setCommission] = useState(0)
  const [referrals, setReferrals] = useState(0)
  const [claimHistory, setClaimHistory] = useState(0)
  const [showSpinner, setShowSpinner] = useState(false);

  const [alertMessage, setAlertMessage] = useState({
    type: ALERT_EMPTY,
    message: "",
  });

  useEffect(() => {
    if (wallet.address != null) loadWeb3Modal();
  }, []);

  const logoutOfWeb3Modal = async () => {
    web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect === "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setIsConnected(false);
  };

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    const web3Provider = new Web3(provider);
    const chainId = await web3Provider.eth.getChainId();
    if (chainId != 5) switchNetwork()

    setInjectedProvider(web3Provider);
    var acc = null;
    try {
      acc = provider.selectedAddress
        ? provider.selectedAddress
        : provider.accounts[0];
    } catch (error) {
      acc = provider.address;
    }

    setWeb3(web3Provider);
    setFineVipContract(getFineVipContract(web3Provider));
    setUsdcContract(getUSDCContract(web3Provider));
    setUsdtContract(getUSDTContract(web3Provider));
    setFineContract(getFineVipContract(web3Provider));
    setStakingContract(getStakingContract(web3Provider));
    setSwapContract(getSwapContract(web3Provider));
    setCurAcount(acc);
    setIsConnected(true);

    dispatch(
      setWallet({
        address: acc,
        provider: web3Provider,
      })
    );

    provider.on("chainChanged", () => {
      setAlertMessage({
        type: ALERT_ERROR,
        message: "Wrong Network! Please switch to Ethereum Network!",
      });
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", () => {
      setAlertMessage({
        type: ALERT_WARN,
        message: "Current Account Changed!",
      });
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    provider.on("disconnect", (code, reason) => {
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);


  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(5) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: 'Goerli Testnet',
                chainId: '0x05',
                rpcUrls: TEST_RPC
              }
            ]
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (curAcount !== null && fineContract !== undefined) {
          let _rewardHisotry = await stakingContract.methods.getClaimRewardHistory(curAcount).call();
          let _commissionHisotry = await stakingContract.methods.getClaimCommissionHistory(curAcount).call();
          let _commission = await stakingContract.methods.referralAmount(curAcount).call();
          let _referrals = await swapContract.methods.getReferrals(curAcount).call();


          let unique = [...new Map(_referrals.map((m) => [m.refer, m])).values()];
          let _soldFineAmount = _referrals.reduce((val, row) => {
            let value = val + Number(CUSTOM_WEB3.utils.fromWei(row[1], "ether"))
            return value
          }, 0)

          let newHistory = _rewardHisotry.concat(_commissionHisotry)
          let sortedHistory = newHistory.sort((a, b) => b[1] - a[1])
          let _claimAmount = sortedHistory.reduce((val, row) => {
            let value = val + Number(CUSTOM_WEB3.utils.fromWei(row[0], "mwei"))
            return value
          }, 0)

          setCommission(CUSTOM_WEB3.utils.fromWei(_commission, "mwei"))
          setClaimAmount(_claimAmount.toFixed(2))
          setSoldFineAmount(_soldFineAmount)
          setClaimHistory(sortedHistory)
          setReferrals(unique.length)
          getWallletInfo()
          getStakingInfo()
        }
      } catch (error) {
        console.log("fetchData error: ", error);
      }
    };

    fetchData();
  }, [isConnected]);

  const getWallletInfo = async () => {
    let fineBalance = await fineContract.methods.balanceOf(curAcount).call();
    let usdcBalance = await usdcContract.methods.balanceOf(curAcount).call();
    let usdtBalance = await usdtContract.methods.balanceOf(curAcount).call();

    setWalletBalances([web3.utils.fromWei(usdcBalance, "mwei"), web3.utils.fromWei(usdtBalance, "mwei"), web3.utils.fromWei(fineBalance, "ether")])
  }

  const getStakingInfo = async () => {
    let _stakedBalance = await stakingContract.methods.stakingTAmount(curAcount).call();
    let _stakingHisotry = await stakingContract.methods.getStakingHistory(curAcount).call();
    let _referralAmount = await stakingContract.methods.referralAmount(curAcount).call();
    let _availableRewards = await stakingContract.methods.availableRewards(curAcount).call();

    let _commision = _availableRewards[0] > 0 ? web3.utils.fromWei(_availableRewards[0], "mwei") : 0
    let _reward = _availableRewards[1] > 0 ? web3.utils.fromWei(_availableRewards[1], "mwei") : 0
    let currentTime = Math.floor(Date.now() / 1000)
    let _rewardAmount = _stakingHisotry.reduce((val, row) => {
      let passTime = currentTime - row[1]
      let value = val + CUSTOM_WEB3.utils.fromWei(row[0], "ether") * row[3] * parseInt(passTime / ClaimPeriod) / 10;
      return value;
    }, 0)

    setAvailableRewards(Number(_commision) + Number(_reward))
    setStakingHistory(_stakingHisotry);
    setReferralAmount(_referralAmount);
    setRewardAmount(_rewardAmount.toFixed(2));
    setStakedBalance(web3.utils.fromWei(_stakedBalance, "ether"))
  }

  const switchPage = (pageName) => { setCurrentPage(pageName); };

  const buyToken = async (amount, coin) => {
    let approveRes;
    let search = window.location.search
    let refer = search.split("=")[1]
    if (refer == undefined || refer.length != 42 || refer.toLocaleLowerCase() == ZERO_ADDRESS.toLowerCase()) refer = ZERO_ADDRESS;
    if (amount < 20) {
      toast.warn('Please enter a minimum purchase amount (20 USDC/USDT)', { pauseOnFocusLoss: false });
      return;
    }
    if (web3.utils.toChecksumAddress(wallet.address)) {
      try {
        if (coin == "USDC") {
          approveRes = await usdcContract.methods
            .approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei"))
            .send({ from: wallet.address });
        } else {
          approveRes = await usdtContract.methods
            .approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei"))
            .send({ from: wallet.address });
        }
      } catch (error) {
        console.log('approve error', error)
      }
      let token = coin == 'USDC' ? true : false;
      if (approveRes.transactionHash) {
        swapContract.methods
          .Buy(
            web3.utils.toWei(amount, "mwei"),
            refer,
            token
          ).send({ from: wallet.address })
          .then((res) => {
            toast.success('Successfully purchased token', { pauseOnFocusLoss: false });
            getWallletInfo()
          })
          .catch((error) => {
            console.log('error', error)
          });;
      }
    } else {
      toast.warn('Please connect wallet before buy', { pauseOnFocusLoss: false });
    }
  };

  const stakeFine = async (_amount) => {
    setShowSpinner(true)
    if (_amount == 0) {
      toast.warning('Please input correct amount', { pauseOnFocusLoss: false });
      return;
    }
    if (web3.utils.toChecksumAddress(wallet.address)) {
      fineContract.methods
        .approve(STAKING_ADDRESS, web3.utils.toWei(_amount, "ether"))
        .send({ from: curAcount })
        .then(async (res) => {
          if (res.transactionHash) {
            stakingContract.methods
              .Stake(web3.utils.toWei(_amount, "ether"))
              .send({ from: curAcount })
              .then((res) => {
                toast.success('Successfully staked', { pauseOnFocusLoss: false });
                getWallletInfo()
                getStakingInfo()
                window.location.reload();
              })
              .catch((error) => {
                toast.error('failed staked', { pauseOnFocusLoss: false });
                console.log('error', error)
              });;
          }
        })
        .catch((error) => {
          toast.error('failed staked', { pauseOnFocusLoss: false });
          console.log('error', error)
        });
    } else {
      return false
    }
    setShowSpinner(false)
  };

  const unStake = async (idx) => {
    setShowSpinner(true)
    stakingContract.methods.Unstake(idx).send({ from: curAcount })
      .then((res) => {
        toast.success('Successfully unstaked', { pauseOnFocusLoss: false });
        window.location.reload();
      })
      .catch((error) => {
        toast.error('failed unstaked', { pauseOnFocusLoss: false });
        console.log('error', error)
      });
    getWallletInfo()
    getStakingInfo()
    setShowSpinner(false)
  };

  const claimReward = async () => {
    setShowSpinner(true)
    stakingContract.methods.claimReward().estimateGas({from: wallet.address}).then((res) => {
      console.log('re', res)
    }).catch((error) => {
      console.log('eee', error)
    })
    try {
      stakingContract.methods.claimReward().send({ from: wallet.address })
        .then((res) => {
          toast.success('Successfully claimed', { pauseOnFocusLoss: false });
          window.location.reload();
        })
        .catch((error) => {
          toast.error('failed claimed', { pauseOnFocusLoss: false });
          console.log('error', error)
        });;
    } catch (error) {
      console.log('error', error)
    }
    // getWallletInfo()
    // getStakingInfo()
    setShowSpinner(false)
  }

  const sendFine = async (amount, address) => {
    setShowSpinner(true)
    if (amount == 0 || Number(amount) > Number(walletBalances[2])) {
      toast.warn('Please input correct amount', { pauseOnFocusLoss: false });
      return;
    }
    if (address.length !== 42) {
      toast.warn('Please input correct address', { pauseOnFocusLoss: false });
      return
    }
    fineContract.methods.transfer(address, CUSTOM_WEB3.utils.toWei(amount, "ether"))
      .send({ from: wallet.address })
      .then((res) => {
        toast.success('Successfully sent', { pauseOnFocusLoss: false });
      })
      .catch((error) => {
        toast.error('Transaction failed', { pauseOnFocusLoss: false });
        console.log('error', error)
      });
    getWallletInfo()
    setShowSpinner(false)
  };

  return (
    <>
      <div className="d-flex">
        <LeftPanel
          currentPage={currentPage}
          switchPage={(params) => switchPage(params)}
          mobileMenuOpen={mobileMenuOpen}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          isConnected={isConnected}
          setMobileMenuClose={() => {
            setMobileMenuOpen(false);
          }}
        />
        <div className="right-panel">
          <div
            className="background-F8 d-flex justify-content-between mb-5 fw-800 align-items-center"
            style={{ height: "60px", padding: "6px 23px 6px 35px" }}
          >
            <div className="d-sm-flex d-none ">
              {currentPage === "buyPage" && "Buy Token"}{" "}
              {(currentPage === "" || currentPage === "stakePage") &&
                "Stake & Earn"}
            </div>
            <div className="d-flex gap-4 justify-content-sm-end justify-content-between w-100 flex-1" style={{ gap: "32px" }}>
              <div
                className="d-flex align-items-center gap-2 px-2 d-sm-flex d-none"
                style={{ border: "1px solid #D7D9CF", borderRadius: "5px", paddingLeft: "13.1px" }}
              >
                <div>
                  <img src={walletIco} style={{ height: "25.24px" }} />
                </div>
                <div className="fs-10 d-flex gap-2">
                  <div>
                    <div className="fc-828282">{walletBalances[0]}</div>
                    <div className="fc-828282">{walletBalances[1]}</div>
                    <div>{walletBalances[2]}</div>
                  </div>
                  <div>
                    <div>
                      <img src={usdc} style={{ width: "10px" }} />
                    </div>
                    <div>
                      <img src={usdt} style={{ width: "10px" }} />
                    </div>
                    <div>
                      <img src={fine_vip} style={{ width: "10px" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="d-sm-none d-flex cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
              >
                <img src={menu} alt="" />
              </div>
              {isConnected ? (
                <div className="position-relative hover-custom">
                  <button
                    className="px-4 border-0 d-flex align-items-center"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div
                      style={{
                        backgroundColor: "#323232",
                        borderRadius: "2px",
                      }}
                      className="p-2  text-white"
                    >
                      <img src={metamask} alt="" className="me-2" />
                      {curAcount.slice(0, 4)}
                    </div>
                    <div>{" ... " + curAcount.slice(-4)}</div>
                  </button>
                  <div className="hover-item">
                    <div
                      className="position-absolute mx-4 cursor-pointer"
                      onClick={logoutOfWeb3Modal}
                    >
                      <div
                        style={{
                          border: "1px solid #1B212D",
                          borderRadius: "4px",
                          padding: "0.3rem 1.1rem",
                          zIndex: 10,
                          marginTop: "6px",
                        }}
                      >
                        Logout
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="bg-black text-white px-4 py-2"
                  onClick={loadWeb3Modal}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
          {currentPage === "buyPage" &&
            <BuyPanel
              walletBalances={walletBalances}
              soldFineAmount={soldFineAmount}
              commission={commission}
              referrals={referrals}
              buyToken={buyToken}
            />}
          {(currentPage === "" || currentPage === "stakePage") && (
            <StakePanel
              availableRewards={availableRewards}
              walletBalances={walletBalances}
              stakingHistory={stakingHistory}
              stakedBalance={stakedBalance}
              soldFineAmount={soldFineAmount}
              referralAmount={referralAmount}
              stakeFine={stakeFine}
              unStake={unStake}
              claimReward={claimReward}
              claimHistory={claimHistory}
              sendFine={sendFine}
              curAcount={curAcount}
              claimAmount={claimAmount}
              rewardAmount={rewardAmount}
            />
          )}
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default Home;
