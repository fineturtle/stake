import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import copy from "../assets/copy.png";
import fine_vip from "../assets/fine_vip.png";
import light from "../assets/light.png";
import switchico from "../assets/Switch.png";
import usdc from "../assets/usdc.png";
import usdt from "../assets/usdt.png";

import {
  getSwapContract, getUSDCContract,
  getUSDTContract, SWAP_ADDRESS
} from "../constant";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const Buy = (props) => {
  const wallet = useSelector((state) => state.wallet);
  const [fromInputValue, setFromInputValue] = useState("");
  const [toInputValue, setToInputValue] = useState("");
  const [showMenu1, setShowMenu1] = useState(false);
  const menuRef1 = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [currentCoinImg, setCurrentCoinImg] = useState(usdc);
  const [currentCoin, setCurrentCoin] = useState("USDC");
  const [currentCoinImg1, setCurrentCoinImg1] = useState(fine_vip);
  const [currentCoin1, setCurrentCoin1] = useState("FINE-VIP");
  const [walletAddy, setWalletAddy] = useState("");
  const [usdtContract, setUsdtContract] = useState();
  const [usdcContract, setUsdcContract] = useState();
  const [swapContract, setSwapContract] = useState();
  const [web3, setWeb3] = useState();

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const handleCoin = (coin) => {
    if (coin === "usdc") {
      setCurrentCoinImg(usdc);
      setCurrentCoin("USDC");
      if (currentCoin1 == "USDC") {
        setCurrentCoinImg1(fine_vip);
        setCurrentCoin1("FINE-VIP");
      }
    }
    if (coin === "usdt") {
      setCurrentCoinImg(usdt);
      setCurrentCoin("USDT");
      if (currentCoin1 == "USDT") {
        setCurrentCoinImg1(usdt);
        setCurrentCoin1("USDC");
      }
    }
  };
  const handleToggleMenu1 = () => {
    setShowMenu1(!showMenu1);
  };

  const handleClickOutsideMenu1 = (event) => {
    if (menuRef1.current && !menuRef1.current.contains(event.target)) {
      setShowMenu1(false);
    }
  };

  useEffect(() => {
    setWalletAddy(wallet.address);
    if (wallet.provider !== null) {
      setUsdtContract(getUSDTContract(wallet.provider));
      setUsdcContract(getUSDCContract(wallet.provider));
      setSwapContract(getSwapContract(wallet.provider));
      setWeb3(wallet.provider);
    }

    document.addEventListener("mousedown", handleClickOutsideMenu1);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu1);
    };
  }, []);

  const copyAddy = () => {
    navigator.clipboard.writeText("https://stake.fineturtle.com/?ref=" + wallet.address).then(
      () => {
        toast.success('Copied!', { pauseOnFocusLoss: false });
      },
      () => {
        toast.error('Copy failed!', { pauseOnFocusLoss: false });
      }
    );
  };

  return (
    <div className="">
      <div className="d-flex flex-column flex-sm-row" style={{ gap: "52px" }}>
        <div className="flex-1 position-relative" style={{ gap: "12px" }}>
          <div className="fw-800">
            <span className="border-bottom-custom1">Buy FINE-VIP</span>
            <div className="border-bottom-custom2"></div>
          </div>

          <div
            className="background-F8 "
            style={{ marginTop: "24px", padding: "8px 1.5rem", marginBottom: "12px" }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <div className="fc-929EAE fs-14">From</div>
                <div className="">
                  <input
                    style={{ outlineWidth: 0 }}
                    name="coin"
                    className="border-0 background-F8 mobile-input-width fs-16"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    min="0"
                    value={fromInputValue}
                    onChange={(e) => {
                      setFromInputValue(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <div>
                  <span className="fc-929EAE">Balance</span> &nbsp;0.00
                </div>
                <div
                  className="position-relative cursor-pointer"
                  style={{ textAlign: "left" }}
                >
                  <div
                    onClick={handleToggleMenu}
                    className="d-flex justify-content-end"
                  >
                    <div>
                      <img
                        src={currentCoinImg}
                        style={{ width: "19px" }}
                        alt="current coin"
                      />{" "}
                      {currentCoin}{" "}
                    </div>
                    <div className="ms-2">
                      <small>▼</small>
                    </div>
                  </div>
                  {showMenu && (
                    <div
                      ref={menuRef}
                      style={{
                        position: "absolute",
                        top: "100%",
                        backgroundColor: "white",
                        boxShadow: "0px 0px 5px grey",
                        padding: "10px",
                        transition: "opacity 0.3s ease",
                        opacity: showMenu ? 1 : 0,
                        zIndex: 100,
                      }}
                    >
                      <div
                        onClick={() => {
                          handleToggleMenu();
                          handleCoin("usdc");
                        }}
                      >
                        <img src={usdc} style={{ width: "19px" }} alt="usdc" />{" "}
                        USDC
                      </div>
                      <div
                        onClick={() => {
                          handleToggleMenu();
                          handleCoin("usdt");
                        }}
                      >
                        <img src={usdt} style={{ width: "19px" }} alt="usdt" />{" "}
                        USDT
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "-20px" }}
          >
            <img
              className="cursor-pointer"
              src={switchico}
              style={{ width: "60px" }}
              alt="swap icon"
            />
          </div>
          <div className="background-F8 " style={{ marginTop: "-20px", padding: "8px 1.5rem" }}>
            <div
              className="d-flex justify-content-between"
            >
              <div>
                <div className="fc-929EAE fs-14">To</div>
                <div>
                  <input
                    style={{ outlineWidth: 0 }}
                    name="coin"
                    className="border-0 background-F8 mobile-input-width fs-16"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    min="0"
                    value={fromInputValue/10}
                    onChange={(e) => {
                      setToInputValue(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <div>
                  <span className="fc-929EAE">Balance</span> &nbsp;0.00
                </div>
                <div
                  className="position-relative cursor-pointer"
                  style={{ textAlign: "left" }}
                >
                  <div
                    onClick={handleToggleMenu1}
                    className="d-flex justify-content-end"
                  >
                    <div>
                      <img
                        src={currentCoinImg1}
                        style={{ width: "19px" }}
                        alt="current coin"
                      />{" "}
                      {currentCoin1}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <button
              className="w-100 bg-black text-white "
              onClick={() => {props.buyToken(fromInputValue, currentCoin)}}
              style={{ paddingTop: "14px", paddingBottom: "14px", borderRadius: "3px" }}
            >
              BUY
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="fw-800">
            <span className="border-bottom-custom1 ">Referral Overview</span>
            <div className="border-bottom-custom2" style={{ marginTop: "14px" }}></div>
          </div>
          <div className="d-flex gap-5 mt-4 flex-column flex-sm-row">
            <div className="border-dot flex-1">
              <div className="d-flex gap-2 align-items-center" style={{ padding: "31.5px 28.5px" }}>
                <div>
                  <img src={light} alt="" style={{ width: "36px", borderRadius: "2px" }} />
                </div>
                <div>
                  <div className="fs-14 fc-929EAE">Token Sold</div>
                  <div className="fs-18 fw-800">{Number(props.soldFineAmount).toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="border-dot flex-1" style={{ padding: "31.5px 28.5px"}}>
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <img src={light} alt="" style={{ width: "36px", borderRadius: "2px" }} />
                </div>
                <div>
                  <div className="fs-14 fc-929EAE">Total Commission</div>
                  <div className="fs-18 fw-800">{props.soldFineAmount * 1.5} USDC</div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-dot flex-1" style={{ marginTop: "10px", padding: "31.5px 28.5px" }}>
            <div className="d-flex gap-2 align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img src={light} alt="" style={{ width: "36px", borderRadius: "2px" }} />
                <div className="fs-14 fc-929EAE">All Referrals</div>
              </div>
              <div>
                <div className="fw-800 fs-18">{props.referrals > 0 ? props.referrals : 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-5  flex-column flex-md-row">
        <div className="flex-1">
          <div className="fw-800 my-2">The Purpose of FINE-VIP</div>
          <div className="ps-3">
            <div className="fc-929EAE fs-14 mt-3">
              Staking FINE-VIP is a way to earn daily interest of 0.20% until
              the official launch date of Fine Turtle
            </div>
            <div className="fc-929EAE fs-14 mt-2">
              Additionally, FINE-VIP can be utilized to mint or purchase Fine
              Turtle NFTs at a 20% discount compared to the public mint price
            </div>
          </div>
        </div>
        {/* <div className="flex-1">
          <div className="my-2 fw-800">USDC.ERC20 Address</div>
          <div className="progress border border-success w-border my-2">
            <div
              className="progress-bar w-border-bar"
              role="progressbar"
              aria-valuenow="130"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="my-4 p-3 background-F8 break-all">
            0x6C2f72145d0077a5Dab18fDDa144E45F9c3c489B
          </div>
          <div>
            <button className="primary-button rounded-1 w-100 py-1 ">
              Confirm Payout Method
            </button>
          </div>
        </div> */}
        <div className="flex-1">
          <div className="my-2 fw-800">
            <span className="border-bottom-custom1 ">Refer your friend</span>
            <div className="border-bottom-custom2" style={{marginTop: "14px"}}></div>
          </div>
          <div className="fc-929EAE mt-4">15% commission on token sold</div>
          <div className="p-3 background-F8" style={{ marginTop: "44px" }}>
            <div className="d-flex justify-content-between">
              <div>
                <div className="fc-929EAE fs-14">Your Referrals Link</div>
                {/* <div className="fs-16">https://www.stake.fineture.com?ref={wallet.address}</div> */}
                <div className="fs-16">https://stake.fineturtle.com/?ref={(wallet.address).slice(0,6) + "..." + (wallet.address).slice(-4)}</div>
              </div>
              <div>
                <button className="primary-button w-100" style={{ padding: "14px 30px" }} onClick={copyAddy}>
                  COPY <img src={copy} alt="copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Buy;
