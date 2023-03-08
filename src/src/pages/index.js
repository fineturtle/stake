import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Web3 from "web3";
import { ClaimPeriod, customAmount, CUSTOM_WEB3, FINE_VIP_ADDRESS, FINE_VIP_ADDRESS1, maxAmount, STAKING_ADDRESS, STAKING_ADDRESS1, SWAP_ADDRESS, SWAP_ADDRESS1, USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS } from "../constant";
import web3ModalSetup from "./../helpers/web3ModalSetup";

import BuyPanel from "../components/buy";
import LeftPanel from "../components/leftPanel";
import Spinner from "../components/loading/Spinner";
import StakePanel from "../components/stake";

import fine_vip from "../assets/fine_vip.png";
import menu from "../assets/menu.png";
import metamask from "../assets/metamask.png";
import polygon from '../assets/polygon.png';
import usdc from "../assets/usdc.png";
import usdt from "../assets/usdt.png";
import walletIco from "../assets/wallet.png";

import Fine_VIP_ABI from "../constant/finevip.json";
import Fine_VIP_ABI1 from "../constant/finevip1.json";
import Staking_ABI from '../constant/staking.json';
import Staking_ABI1 from '../constant/staking1.json';
import Swap_ABI from '../constant/swap.json';
import Swap_ABI1 from '../constant/swap1.json';
import USDC_ABI from "../constant/usdc.json";

import { setWallet } from "../app/reducers/walletReducer";

const web3Modal = web3ModalSetup();

const Home = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (chainId !== 137) {
      toast.warning('Please chage network to Polygon', { pauseOnFocusLoss: false });
      return;
    }

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
    setUsdcContract(new web3Provider.eth.Contract(USDC_ABI, USDC_ADDRESS));
    setUsdtContract(new web3Provider.eth.Contract(USDC_ABI, USDT_ADDRESS));
    setSwapContract(new web3Provider.eth.Contract(Swap_ABI, SWAP_ADDRESS));
    setFineContract(new web3Provider.eth.Contract(Fine_VIP_ABI, FINE_VIP_ADDRESS));
    setStakingContract(new web3Provider.eth.Contract(Staking_ABI, STAKING_ADDRESS));
    setCurAcount(acc);
    setIsConnected(true);

    dispatch(
      setWallet({
        address: acc,
        provider: web3Provider,
      })
    );

    provider.on("chainChanged", () => {
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", () => {
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
        params: [{ chainId: web3.utils.toHex(POlYGON) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: 'Polygon Network',
                chainId: web3.utils.toHex(POlYGON),
                rpcUrls: POLYGON_RPC
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
        if (curAcount !== null && fineContract !== undefined && swapContract !== undefined && stakingContract !== undefined) {
          getWallletInfo()
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

    setWalletBalances([
      web3.utils.fromWei(usdcBalance, "mwei"),
      web3.utils.fromWei(usdtBalance, "mwei"),
      web3.utils.fromWei(fineBalance, "ether")])
    getStakingInfo()
    getUserInfo()
  }

  const getUserInfo = async () => {
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
    setShowSpinner(true)
    let gas = await web3.eth.getGasPrice();
    // var block = await web3.eth.getBlock("latest");
    let search = window.location.search
    let refer = search.split("=")[1]
    if (refer === undefined || refer.length !== 42 || refer.toLocaleLowerCase() === ZERO_ADDRESS.toLowerCase()) refer = ZERO_ADDRESS;

    if (amount < 20) {
      toast.warn('Please enter a minimum purchase amount (20 USDC/USDT)', { pauseOnFocusLoss: false });
      setShowSpinner(false)
      return;
    }

    if (web3.utils.toChecksumAddress(wallet.address)) {
      try {
        if (coin === "USDC") {
          try {
            let _gasLimit = await usdcContract.methods.approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei")).estimateGas({ from: wallet.address })
            usdcContract.methods
              .approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei"))
              .send({
                from: wallet.address,
                gasLimit: Math.floor(_gasLimit * 1.1),
                gasPrice: (Math.floor(gas * 1.1)).toString(10)
              })
              .then((res) => {
                _buyToken(swapContract, coin, amount, refer)
              });
          } catch (error) {
            setShowSpinner(false)
            console.log(error)
            toast.error('Failed Approve', { pauseOnFocusLoss: false });
          }
        } else {
          try {
            let _gasLimit = await usdtContract.methods.approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei")).estimateGas({ from: wallet.address })
            usdtContract.methods
              .approve(SWAP_ADDRESS, web3.utils.toWei(amount, "mwei"))
              .send({
                from: wallet.address,
                gasLimit: Math.floor(_gasLimit * 1.1),
                gasPrice: (Math.floor(gas * 1.1)).toString(10)
              })
              .then((res) => {
                _buyToken(swapContract, coin, amount, refer)
              })
              .catch(error => {
                setShowSpinner(false)
                console.log('error', error)
                toast.error('Failed Approve', { pauseOnFocusLoss: false });
              });
          } catch (error) {
            console.log(error)
            setShowSpinner(false)
            toast.error('Failed Approve', { pauseOnFocusLoss: false });
          }
        }
      } catch (error) {
        console.log('approve error', error)
        setShowSpinner(false)
        toast.error('Failed Approve', { pauseOnFocusLoss: false });
      }
    } else {
      toast.warn('Please connect wallet before buy', { pauseOnFocusLoss: false });
      setShowSpinner(false)
    }
  };

  const _buyToken = async (_contract, _coin, _amount, _refer) => {
    let gas = await web3.eth.getGasPrice();
    let token = _coin === 'USDC' ? true : false;
    try {
      let _gasLimit = await _contract.methods.Buy(web3.utils.toWei(_amount, "mwei"), _refer, token).estimateGas({ from: wallet.address })
      _contract.methods
        .Buy(
          web3.utils.toWei(_amount, "mwei"),
          _refer,
          token
        ).send({
          from: wallet.address,
          gasLimit: Math.floor(_gasLimit * 1.1),
          gasPrice: (Math.floor(gas * 1.1)).toString(10)
        })
        .then((res) => {
          toast.success('Successfully purchased token', { pauseOnFocusLoss: false });
          getWallletInfo()
          setShowSpinner(false)
        })
        .catch((error) => {
          console.log('error', error)
          setShowSpinner(false)
          toast.success('Successfully purchased token', { pauseOnFocusLoss: false });
        });
    } catch (error) {
      console.log(error)
      setShowSpinner(false)
      toast.success('Successfully purchased token', { pauseOnFocusLoss: false });
    }
  }

  const stakeFine = async (_amount) => {
    setShowSpinner(true)
    if (_amount === 0) {
      toast.warning('Please input correct amount', { pauseOnFocusLoss: false });
      return;
    }

    if (web3.utils.toChecksumAddress(wallet.address)) {
      let gas = await web3.eth.getGasPrice();
      try {
        let _gasLimit = await fineContract.methods.approve(STAKING_ADDRESS, web3.utils.toWei(_amount, "ether")).estimateGas({ from: curAcount })
        fineContract.methods.approve(STAKING_ADDRESS, web3.utils.toWei(_amount, "ether"))
          .send({
            from: curAcount,
            gasLimit: Math.floor(_gasLimit * 1.1),
            gasPrice: (Math.floor(gas * 1.1)).toString(10)
          })
          .then(async (res) => {
            let gas1 = await web3.eth.getGasPrice();
            let _gasLimit1 = await stakingContract.methods.Stake(web3.utils.toWei(_amount, "ether")).estimateGas({ from: curAcount })
            stakingContract.methods
              .Stake(web3.utils.toWei(_amount, "ether"))
              .send({
                from: curAcount,
                gasLimit: Math.floor(_gasLimit1 * 1.1),
                gasPrice: (Math.floor(gas1 * 1.1)).toString(10)
              })
              .then((res) => {
                toast.success('Successfully staked', { pauseOnFocusLoss: false });
                window.location.reload();
                setShowSpinner(false)
              })
              .catch((error) => {
                toast.error('Failed staked', { pauseOnFocusLoss: false });
                console.log('error-->', error)
                setShowSpinner(false)
              });
          }).catch((error) => {
            setShowSpinner(false)
            toast.error('Failed staked', { pauseOnFocusLoss: false });
            console.log('stake estimate gas error', error)
          })
      } catch (error) {
        setShowSpinner(false)
        toast.error('Failed staked', { pauseOnFocusLoss: false });
        console.log(error)
      }
    } else {
      setShowSpinner(false)
      toast.error('Failed staked', { pauseOnFocusLoss: false });
      return false
    }
  };

  const unStake = async (idx) => {
    setShowSpinner(true)
    let gas = await web3.eth.getGasPrice();
    try {
      let _gasLimit = await stakingContract.methods.Unstake(idx).estimateGas({ from: curAcount })
      stakingContract.methods.Unstake(idx).send({
        from: curAcount,
        gasLimit: Math.floor(_gasLimit * 1.1),
        gasPrice: (Math.floor(gas * 1.1)).toString(10)
      })
        .then((res) => {
          toast.success('Successfully unstaked', { pauseOnFocusLoss: false });
          window.location.reload();
          setShowSpinner(false)
        })
        .catch((error) => {
          setShowSpinner(false)
          toast.error('Failed unstaked', { pauseOnFocusLoss: false });
          console.log('error', error)
        });
    } catch (error) {
      setShowSpinner(false)
      toast.error('Failed unstaked', { pauseOnFocusLoss: false });
      console.log('error', error)
    }
  };

  const claimReward = async () => {
    setShowSpinner(true)
    let gas = await web3.eth.getGasPrice();

    try {
      let _gasLimit = await stakingContract.methods.claimReward().estimateGas({ from: wallet.address })
      stakingContract.methods.claimReward().send({
        from: wallet.address,
        gasLimit: Math.floor(_gasLimit * 1.1),
        gasPrice: (Math.floor(gas * 1.1)).toString(10)
      })
        .then((res) => {
          toast.success('Successfully claimed', { pauseOnFocusLoss: false });
          window.location.reload();
          setShowSpinner(false)
        })
        .catch((error) => {
          toast.error('Failed claimed', { pauseOnFocusLoss: false });
          console.log('error', error)
          setShowSpinner(false)
        });
    } catch (error) {
      console.log(error)
      setShowSpinner(false)
      toast.error('Failed claimed', { pauseOnFocusLoss: false });
    }
  }

  const sendFine = async (amount, address) => {
    setShowSpinner(true)
    let gas = await web3.eth.getGasPrice();

    if (amount === 0 || Number(amount) > Number(walletBalances[2])) {
      toast.warn('Please input correct amount', { pauseOnFocusLoss: false });
      setShowSpinner(false)
      return;
    }
    if (address.length !== 42) {
      toast.warn('Please input correct address', { pauseOnFocusLoss: false });
      setShowSpinner(false)
      return
    }

    try {
      let _gasLimit = await fineContract.methods.transfer(address, CUSTOM_WEB3.utils.toWei(amount, "ether")).estimateGas({ from: wallet.address })
      fineContract.methods.transfer(address, CUSTOM_WEB3.utils.toWei(amount, "ether"))
        .send({
          from: wallet.address,
          gasLimit: Math.floor(_gasLimit * 1.1),
          gasPrice: (Math.floor(gas * 1.1)).toString(10)
        })
        .then((res) => {
          toast.success('Successfully sent', { pauseOnFocusLoss: false });
          setShowSpinner(false)
          getWallletInfo()
        })
        .catch((error) => {
          toast.error('Transaction failed', { pauseOnFocusLoss: false });
          setShowSpinner(false)
          console.log('error', error)
        });
    } catch (error) {
      console.log(error)
      setShowSpinner(false)
      toast.error('Transaction failed', { pauseOnFocusLoss: false });
    }
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
            className="background-F8 d-flex justify-content-between mb-5 fw-800 align-items-center header"
          >
            <div className="d-sm-flex d-none ">
              {currentPage === "buyPage" && "Buy Token"}{" "}
              {(currentPage === "" || currentPage === "stakePage") &&
                "Stake & Earn"}
            </div>
            <div className="d-flex gap-4 justify-content-sm-end justify-content-between w-100 flex-1" style={{ gap: "32px" }}>
              <div className="d-sm-flex d-none align-items-center" style={{ fontSize: "10px", gap: "8px" }}>
                <img src={polygon} alt="polygon" style={{ height: "25px" }} />
                Polygon Mainnet
              </div>
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
                    <div>{walletBalances[2] > 0 ? Number(walletBalances[2]).toFixed(2) : "0.00"}</div>
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
                <img src={menu} alt="menu" />
              </div>
              <div className="right-btns d-flex justify-content-sm-end ">
                <div className="d-sm-none d-flex align-items-center polygon" style={{ fontSize: "10px", gap: "8px" }}>
                  <img src={polygon} alt="polygon" style={{ height: "25px" }} />
                  Polygon Mainnet
                </div>
                {isConnected ? (
                  <>
                    <div className="position-relative hover-custom">
                      <button
                        className="px-md-4 border-0 d-flex align-items-center"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <div
                          style={{
                            backgroundColor: "#323232",
                            borderRadius: "2px",
                          }}
                          className="p-2  text-white"
                        >
                          <img src={metamask} alt="metamask" className="me-2 metamask" />
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
                  </>
                ) : (
                  <button
                    className="bg-black text-white px-md-4 py-2 "
                    onClick={loadWeb3Modal}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
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
