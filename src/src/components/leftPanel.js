import React from "react";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import logo from "../assets/logo.png";
import buy from "../assets/buy.png";
import buyActive from "../assets/buy_active.png";
import stake from "../assets/stake.png";
import stakeActive from "../assets/stake_active.png";
import panelBg from "../assets/left_panel_bg.png";
import close from "../assets/close.png";
import Vector from "../assets/Vector.png";
const LeftPanel = (props) => {
  const [open, setOpen] = useState(props.mobileMenuOpen);

  useEffect(() => {
    setOpen(props.mobileMenuOpen);
  }, [props.mobileMenuOpen]);
  return (
    <>
      <div className="left-panel">
        <div style={{ padding: "31px 0 0 24px" }}>
          <img src={logo} alt="logo" className="cursor-pointer" />
        </div>
        <div className="position-absolute left-panel-switch">
          <div
            className={`d-flex gap-2 cursor-pointer align-items-center ps-3 p-1 ${props.currentPage === "buyPage" ? "switch-active" : ""
              }`}
            onClick={() => props.switchPage("buyPage")}
          >
            <div className="page-icons">
              {props.currentPage === "buyPage" ? (
                <img src={buyActive} alt="buy page active" />
              ) : (
                <img src={buy} alt="buy page" />
              )}
            </div>
            <div className="fs-14">Buy Tokens</div>
          </div>
          <div
            className={`d-flex gap-2 cursor-pointer align-items-center ps-3 p-1 ${props.currentPage === "" || props.currentPage === "stakePage"
              ? "switch-active"
              : ""
              }`}
            onClick={() => props.switchPage("stakePage")}
          >
            <div>
              {props.currentPage === "" || props.currentPage === "stakePage" ? (
                <img src={stakeActive} alt="stake page active" />
              ) : (
                <img src={stake} alt="stake page" />
              )}
            </div>
            <div className="fs-14">Stake & Earn</div>
          </div>
        </div>

        <div className="position-absolute left-panel-botton">
          <img className="left-panel-bg" src={panelBg} alt="left panel bg" />
          {props.isConnected && (
            <div
              className="fc-888888 ps-4 cursor-pointer"
              onClick={props.logoutOfWeb3Modal}
            >
              <img src={Vector} alt="log out" style={{ paddingRight: "15px" }} />
              <span className="fs-14">Logout</span>
            </div>
          )}
        </div>
      </div>
      {open && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setOpen(false);
            props.setMobileMenuClose(false);
          }}
        >
          <div className="mini-left-panel p-2">
            <div className="position-relative p-4 " style={{ color: "#8A8A8A" }}>
              <div
                className="cursor-pointer "
                onClick={() => {
                  setOpen(false);
                  props.setMobileMenuClose(false);
                }}
              >
                <img src={close} alt="" />
              </div>
              <div className="d-flex justify-content-between mt-4">
                <img src={logo} alt="logo" className="cursor-pointer" />
              </div>
              <div
                className={`d-flex gap-2 cursor-pointer align-items-center mt-4 ps-3 p-1 ${props.currentPage === "buyPage" ? "switch-active" : ""
                  }`}
                onClick={() => {
                  props.switchPage("buyPage");
                  props.setMobileMenuClose(false);
                  setOpen((prev) => !prev)
                }}

              >
                <div>
                  {props.currentPage === "buyPage" ? (
                    <img src={buyActive} alt="buy page active" />
                  ) : (
                    <img src={buy} alt="buy page active" />
                  )}
                </div>
                <div className="fs-14">Buy Tokens</div>
              </div>
              <div
                className={`d-flex gap-2 cursor-pointer align-items-center mt-2 ps-3 p-1 ${props.currentPage === "" || props.currentPage === "stakePage"
                  ? "switch-active"
                  : ""
                  }`}
                onClick={() => {
                  props.switchPage("stakePage");
                  props.setMobileMenuClose(false);
                  setOpen((prev) => !prev)
                }}

              >
                <div>
                  {props.currentPage === "" ||
                    props.currentPage === "stakePage" ? (
                    <img src={stakeActive} alt="stake page" />
                  ) : (
                    <img src={stake} alt="stake page" />
                  )}
                </div>
                <div className="fs-14 ">Stake & Earn</div>
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </>
  );
};
export default LeftPanel;
