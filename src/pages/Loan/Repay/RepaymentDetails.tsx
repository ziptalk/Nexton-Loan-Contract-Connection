import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainButton } from "@vkruglikov/react-telegram-web-app";

import BasicModal from "@/components/common/Modal/BasicModal";
import TransactionConfirmModal from "@/components/common/Modal/TransactionConfirmModal";
import StakingInfo from "@/components/loan/common/StakingInfo.tsx";
import { ConfirmRepaymentModal } from "@/components/loan/Repay/ConfirmRepaymentModal";
import { isDevMode } from "@/utils/isDevMode.ts";
import * as Contract from "@/hooks/contract/useLending";

import {
  RepaymentContentBox,
  RepaymentHeaderBox,
  RepaymentHeaderBoxTitle,
  RepaymentWrapper,
  RepayRateBox,
  RepayRateBoxBottom,
  RepayRateBoxDivider,
  RepayRateBoxHeader,
} from "./RepaymentDetails.styled";
import { Address, toNano } from "@ton/core";

const alwaysVisibleItems = [
  { label: "Borrowed nxTON", value: "000.00 nxTON" },
  { label: "Principal", value: "00000 TON" },
  { label: "LTV", value: "50.0%" },
  { label: "Maturity date", value: "mm.dd.yy" },
];

const stakingInfoItems = [
  {
    header: "Collateralizing NFT info",
    items: [
      { label: "NFT ID", value: "4817sddss863ddddwdwsdwd" },
      { label: "Network", value: "TON" },
      { label: "LTV", value: "95.0%" },
    ],
  },
  {
    header: "Staking info",
    items: [
      { label: "Principal", value: "10,000 TON" },
      { label: "Nominator Pool", value: "DG Pool #1" },
      { label: "Leveraged", value: "X1.0" },
      { label: "Lockup period", value: "60 days" },
      { label: "Unstakable date", value: "DD.MM.YY" },
      { label: "Protocol Fees", value: "2%" },
      { label: "Staking APR", value: "5%" },
      { label: "Total Amount", value: "10,083 TON" },
    ],
  },
];

interface ModalState {
  type: "repay" | "confirmRepay";
  toggled: boolean;
}

const tele = (window as any).Telegram?.WebApp;

// ! Data is currently mocked
const RepaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sendMessage, getNxtonAmount } = Contract.repay();

  const [modal, setModal] = useState<ModalState>({
    type: "confirmRepay",
    toggled: false,
  });

  const toggleModal = () => {
    setModal(prev => ({
      type: prev.type,
      toggled: !prev.toggled,
    }));
  };

  useEffect(() => {
    if (tele) {
      tele.ready();
      tele.BackButton.show();
      tele.onEvent("backButtonClicked", () => {
        navigate("/loan");
      });
    }

    return () => {
      if (tele) {
        tele.offEvent("backButtonClicked");
      }
    };
  }, [navigate]);

  const handleRepayConfirm = useCallback(async () => {
    toggleModal();

    //테스트용 가짜 데이터입니다.
    const nftAddress = Address.parse("kQAtWmWvjg1Yr94RrYK5oXbQYQm6O1_1G6nYppolPvM5d8kv");
    const repayAmount = toNano("1");
    //실제 코드에선 repay 대상 정보가 들어가야합니다.

    const nxtonAmount = await getNxtonAmount();
    console.log(nxtonAmount);
    if (nxtonAmount < repayAmount) {
      //do something.
      //give notification about insufficient token
      return;
    }

    await sendMessage({ amount: repayAmount, nft: nftAddress });

    // NEED TO ADD: SERVER CALL

    setModal({ type: "repay", toggled: true });
  }, [id, sendMessage]);

  return (
    <div>
      <RepaymentWrapper>
        <RepaymentHeaderBox>
          <RepaymentHeaderBoxTitle>
            <h1>Repayment</h1>
          </RepaymentHeaderBoxTitle>
        </RepaymentHeaderBox>

        <RepaymentContentBox>
          <StakingInfo
            isExpandable={true}
            theme="white"
            title="Loan 01"
            alwaysVisibleItems={alwaysVisibleItems}
            stakingInfoItems={stakingInfoItems}
          />

          <RepayRateBox>
            <RepayRateBoxHeader>Amount to be repaid</RepayRateBoxHeader>
            <RepayRateBoxDivider />
            <RepayRateBoxBottom>000.00 nxTON</RepayRateBoxBottom>
          </RepayRateBox>
        </RepaymentContentBox>

        {!isDevMode ? (
          <MainButton text="Pay now" onClick={toggleModal} />
        ) : (
          <button onClick={toggleModal}>Pay now</button>
        )}
      </RepaymentWrapper>

      {false && <TransactionConfirmModal />}
      {modal.type === "confirmRepay" && modal.toggled && (
        <ConfirmRepaymentModal toggleModal={toggleModal} onConfirm={handleRepayConfirm} />
      )}
      {modal.type === "repay" && modal.toggled && (
        <BasicModal isDark type="repay" toggleModal={toggleModal} onClose={() => console.log("Repayed!")} />
      )}
    </div>
  );
};

export default RepaymentDetails;
