import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";
import { toast } from 'react-toastify';

import copy from "../assets/copy.png";
import light from "../assets/light.png";
import {
  CUSTOM_WEB3, UnstakePeriod
} from "../constant";

const Stake = (props) => {
  const wallet = useSelector((state) => state.wallet);

  const [stakeAmount, setStakeAmount] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const onOpenModal1 = () => setOpen1(true);
  const onOpenModal2 = () => setOpen2(true);
  const onOpenModal3 = () => setOpen3(true);
  const onCloseModal1 = () => setOpen1(false);
  const onCloseModal2 = () => setOpen2(false);
  const onCloseModal3 = () => setOpen3(false);

  const [receiverAddy, setReceiverAddy] = useState("");
  const [amountToSend, setAmountToSend] = useState(0);

  const copyAddy = () => {
    navigator.clipboard.writeText(wallet.address).then(
      () => {
        toast.success('Copied!', { pauseOnFocusLoss: false });
      },
      () => {
        toast.error('Copy failed!', { pauseOnFocusLoss: false });
      }
    );
  };

  return (
    <>
      <div className="">
        <div className="d-flex flex-md-row flex-column" style={{ gap: "52px" }}>
          <div className="flex-1  d-flex flex-column justify-content-between">
            <div className="fw-800">
              <span className="border-bottom-custom1 ">My Balance</span>
              <div className="border-bottom-custom2" style={{ marginTop: "14px" }}></div>
            </div>
            <div className="card_img  p-4 mt-3">
              <div className="position-relative">
                <div
                  className="position-absolute top-0 fw-800 fs-20"
                  style={{ letterSpacing: "0.55em" }}
                >
                  FINE TURTLE
                </div>
                <div className="position-absolute w-100 bottom-0">
                  <div className="d-flex justify-content-between fs-16">
                    <div>FINE-VIP: {props.walletBalances[2]}</div>
                    <div className="d-flex gap-2">
                      {
                        props.curAcount != null ?
                          <div>{(props.curAcount).slice(0, 6)}...{(props.curAcount).slice(-4)}</div>
                          :
                          <></>
                      }
                      <div onClick={copyAddy} style={{ cursor: "pointer" }}>
                        <img src={copy} alt="address" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4 gap-4">
              <button
                className="border-0 py-3 flex-1 bg-f8f8f8 fs-14"
                onClick={onOpenModal2}
              >
                Send FINE-VIP
              </button>
              <button
                className="border-0 py-3 flex-1 bg-f8f8f8 fs-14"
                onClick={onOpenModal3}
              >
                Receive FINE-VIP
              </button>
            </div>
          </div>
          <div className="flex-1 flex-column justify-content-between">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginBottom: "35px" }}
            >
              <div className="d-flex flex-column">
                <div className="fw-800">FINE-VIP Staking</div>
                <div className="fs-12 fc-929EAE" style={{ paddingTop: "5px" }}>Stake your token</div>
              </div>
              {/* <div className="fs-14 fc-929EAE">
                Per Month &nbsp;&nbsp;
                <span
                  className="fs-18 text-white px-2 "
                  style={{ backgroundColor: "#363636", borderRadius: "2px" }}
                >
                  6%
                </span>
              </div> */}
            </div>
            <div className="d-flex justify-content-between flex-column flex-sm-row" style={{ gap: "21px" }}>
              <div className="border-dot flex-1" style={{ padding: "24px 14px" }}>
                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <img src={light} alt="" style={{ width: "36px" }} />
                  </div>
                  <div>
                    <div className="fs-14 fc-929EAE">Available to Stack</div>
                    <div className="fs-18">{props.walletBalances[2]} <span className="fs-12">FV</span></div>
                  </div>
                </div>
                <div className="w-100 mt-4">
                  <button
                    onClick={onOpenModal1}
                    className="w-100 primary-button rounded-1 fc-929EAE bg-white fs-14"
                    style={{ padding: "13px" }}
                  >
                    Stake
                  </button>
                </div>
              </div>
              <div className="border-dot flex-1" style={{ padding: "24px 14px" }}>
                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <img src={light} alt="" style={{ width: "36px" }} />
                  </div>
                  <div>
                    <div className="fs-14 fc-929EAE">Available Rewards</div>
                    <div className="fs-18">{props.availableRewards > 0 ? props.availableRewards : "0.00"} <span className="fs-12">USDC</span></div>
                  </div>
                </div>
                <div className="w-100 mt-4">
                  <button className="w-100 bg-black claim-btn fs-14" style={{ padding: "13px" }} onClick={() => {
                    if (props.availableRewards > 0) props.claimReward()
                  }}>
                    Claim Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-4 flex-md-row flex-column" style={{ gap: "52px" }}>
          {/* <div className="flex-2">
            <div className="my-2 fw-800">
              <span className="border-bottom-custom1 ">Reward History</span>
              <div className="border-bottom-custom2"></div>
            </div>
            <div className={`histories`} onScroll={showAllHistory}>
              <div className="fs-12 mt-4 fc-929EAE">Total Rewards</div>
              <div className="fw-800">{props.rewardAmount} USDC</div>
              {
                (props.stakingHistory).length > 0 ?
                  (props.stakingHistory)?.map((row, i) => {
                    if (row[0] > 0) {
                      let currentDate = Math.floor(Date.now() / 1000)
                      let passTime = currentDate - row[1]
                      let items = [];
                      for (let j = 0; j < passTime / 300; j++) {
                        items.push(0)
                      }
                      return items.map((item, idx) => {
                        let stakingDate = new Date((row[1] * 1000) - (idx * 600000))
                        var date = stakingDate.toUTCString()
                        let year = date.slice(12, 16)
                        let month = date.slice(7, 12) + " "
                        let day = date.slice(5, 7) + " "
                        let time = date.slice(4, -3)
                        return (
                          <div className={`reawardTx d-flex align-items-center w-100 justify-content-between my-4`}>
                            <div className="d-flex">
                              <div className="pe-4">
                                <img src={rewardTx} alt="FV icon" />
                              </div>
                              <div className="">
                                <div>#0{(i+1) * idx} / {(CUSTOM_WEB3.utils.fromWei(row[0], "ether"))} FV</div>
                                <div className="fc-929EAE fs-14">{day + month + year}</div>
                              </div>
                            </div>
                            <div>
                              <div className="fs-16"> {CUSTOM_WEB3.utils.fromWei(row[0], "ether") * row[3] / 100} USDC</div>
                              <div className="fc-929EAE fs-14" style={{ textAlign: "right" }}>
                                {row[3] / 10} %
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  })
                  : <div className="reawardTx d-flex align-items-center w-100 justify-content-between my-4">
                    <div className="d-flex">
                      <div className="">
                        <div>You don't have any Reward history</div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div> */}
          <div className="flex-1">
            <div className="my-2 fw-800">
              <span className="border-bottom-custom1 ">Claim History</span>
              <div className="border-bottom-custom2"></div>
            </div>
            <div className="histories">
              <div className="fs-12 mt-4 fc-929EAE">Total Claimed</div>
              <div className="fw-800">{props.claimAmount > 0 ? props.claimAmount : "0.00"} USDC</div>
              {
                (props.claimHistory).length > 0 ?
                  (props.claimHistory)?.map((row, i) => {
                    if (row[0] > 0) {
                      let stakingDate = new Date((row[1] * 1000))
                      var date = stakingDate.toUTCString()
                      let month = date.slice(7, 12) + " "
                      let day = date.slice(5, 7) + " "
                      return (
                        <>
                          <div className="stackTx d-flex align-items-center w-100 justify-content-between px-4 py-2 my-4">
                            <div className="d-flex flex-column border-right pe-3">
                              <div className="fc-929EAE fs-14">{month}</div>
                              <div className="fw-800 fs-12">{day}</div>
                            </div>
                            <div className="fs-14 flex-1 text-end">{row.rewardAmount ? "Reward" : "Refer"}</div>
                            <div className="text-end flex-1 fs-16">{date.slice(16, 25)}  +UTC</div>
                            <div className="fs-16 flex-1 text-end">{CUSTOM_WEB3.utils.fromWei(row[0], "mwei")} USDC</div>
                          </div>
                        </>
                      )
                    }
                  })
                  : <div className="reawardTx d-flex align-items-center w-100 justify-content-between my-4">
                    <div className="d-flex">
                      <div className="">
                        <div>You don't have any Claim history</div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
          <div className="flex-1">
            <div className="my-2 fw-800">
              <span className="border-bottom-custom1 ">Staking Contract</span>
              <div className="border-bottom-custom2"></div>
            </div>
            <div className="histories">
              <div className="fs-12 mt-4 fc-929EAE">Total Staked</div>
              <div className="fw-800">{props.stakedBalance > 0 ? props.stakedBalance : "0.00"} FINE-VIP</div>
              {
                (props.stakingHistory).length > 0 ?

                  props.stakingHistory?.map((row, i) => {
                    let stakingDate = new Date(row[1] * 1000)
                    let currentTime = Math.floor(Date.now() / 1000)
                    let date = stakingDate.toDateString()
                    let passTime = currentTime - row[1]
                    let month = date.slice(4, 7)
                    let day = date.slice(7, 10)
                    return (
                      <div className="stackTx d-flex align-items-center w-100 justify-content-between px-4 py-2 my-4">
                        <div className="d-flex flex-column border-right pe-3">
                          <div className="fc-929EAE fs-14">{month}</div>
                          <div className="fw-800 fs-12">{day}</div>
                        </div>
                        <div className="fs-16">
                          <p style={{ margin: "unset" }}>#0{i + 1} / {CUSTOM_WEB3.utils.fromWei(row[0], "ether")} FV</p>
                          <p className="fs-12" style={{ margin: "unset" }}>value {CUSTOM_WEB3.utils.fromWei(row[0], "ether") * 10} USDC</p>
                        </div>
                        <div className="d-flex flex-column">
                          <button className="unstake-btn" onClick={() => { props.unStake(i) }} disabled={row.unstaked || (UnstakePeriod-passTime>0) ? true : false}>{row.unstaked ? "Unstaked" : "Unstake"}</button>
                        </div>
                      </div>
                    )
                  })
                  :
                  <div className="reawardTx d-flex align-items-center w-100 justify-content-between my-4">
                    <div className="d-flex">
                      <div className="">
                        <div>You don't have any Staking history</div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open1}
        onClose={onCloseModal1}
        center
        classNames={{ root: "z-1050", modal: "w-520px stake-modal" }}
      >
        <div>Your FINEVIP Balance</div>
        <div className="d-inline-block" style={{ marginRight: "20px" }}>
          <div className="fs-12 fc-B0B0B0" style={{ marginTop: '24px' }}>FINEVIP</div>
          <div className="fc-C5C5C5">{props.walletBalances[2]}</div>
        </div>
        <div className="d-inline-block">
          <div className="fs-12 fc-B0B0B0" style={{ marginTop: '24px' }}>USDC Value</div>
          <div className="fc-C5C5C5">{props.walletBalances[2] * 10}</div>
        </div>
        <div style={{ marginTop: "30px", marginBottom: "12px" }}>Amout to Stake</div>
        <div className="">
          <input
            style={{ fontSize: "20px", outlineWidth: 0 }}
            name="coin"
            className="bg-black w-100 fc-C5C5C5 py-2 px-3"
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            min="0"
            value={stakeAmount}
            onChange={(e) => {
              setStakeAmount(e.target.value);
            }}
          />
        </div>
        <div className="d-flex fs-12 justify-content-between align-items-center fc-DADADA" style={{ marginTop: "18px" }}>
          <div>Reward</div>
          <div className="">
            <div className="fc-D8D8D8">0.20% Per Day</div>
            <div className="d-flex justify-content-end fc-929EAE">6% Per Month</div>
          </div>
        </div>
        <div className="fs-12 mt-2 fc-8F8F8F">
          <p style={{ margin: "unset" }}>1. Rewards are calculated based on USDC value</p>
          <p>2. Rewards are given in USDC</p>
        </div>
        <div className="fs-12 mt-2 fc-8F8F8F">
          <p>Once you have staked your FINEVIP token, you will need to wait for a
            period of 7 days before you can unstack them</p>
        </div>
        <div className="mt-2">
          <button className="w-100 py-2 border-0" onClick={() => {
            props.stakeFine(stakeAmount);
            onCloseModal1()
          }}>
            Stake
          </button>
        </div>
      </Modal>

      <Modal
        open={open2}
        onClose={onCloseModal2}
        center
        classNames={{ root: "z-1050", modal: "w-520px stake-modal" }}
      >
        <div className="fs-20">Your FINEVIP Balance</div>
        <div className="mt-2 fs-14 fc-B0B0B0">FINEVIP</div>
        <div className="fc-C5C5C5 fs-16">{props.walletBalances[2]}</div>
        <div className="fs-20" style={{ marginTop: "30px", marginBottom: "12px" }}>Amount to Send</div>
        <div>
          <input
            style={{ fontSize: "16px", outlineWidth: 0 }}
            name="coin"
            className="bg-black w-100 fc-C5C5C5 py-2 px-3"
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            min="0"
            value={amountToSend}
            onChange={(e) => {
              setAmountToSend(e.target.value);
            }}
          />
        </div>
        <div className="fs-20" style={{ marginTop: "18px", marginBottom: "12px" }}>Send to</div>
        <div className="mt-2">
          <input
            style={{ fontSize: "20px", outlineWidth: 0 }}
            name="coin"
            className="bg-black w-100 fc-C5C5C5 py-2 px-3"
            type="text"
            placeholder="ERC20 Address"
            value={receiverAddy}
            onChange={(e) => {
              setReceiverAddy(e.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: "18px" }} className="mb-4">
          <button className="w-100 py-2 border-0" onClick={() => {
            props.sendFine(amountToSend, receiverAddy)
            onCloseModal2()
          }}>
            Send
          </button>
        </div>
      </Modal>

      <Modal
        open={open3}
        onClose={onCloseModal3}
        center
        classNames={{ root: "z-1050", modal: "w-520px stake-modal" }}
      >
        <div className="mb-4">Your ERC20 Address</div>
        <div className="fc-C5C5C5 break-all">
          {wallet.address}
        </div>
        <div className="mt-3">
          <button className="w-100 py-2 border-0" onClick={copyAddy}>
            Copy Your Address
          </button>
        </div>
      </Modal>
    </>
  );
};
export default Stake;
