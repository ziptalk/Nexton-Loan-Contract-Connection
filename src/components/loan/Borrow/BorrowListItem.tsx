import { useNavigate } from "react-router-dom";

import { nftInfo } from "@/types/Nft";
import { DDayChange, expiredDateChanger } from "@/utils/dateChanger";
import { numberCutter } from "@/utils/numberCutter";

import {
  BorrowListBottom,
  BorrowListBottomTextBottom,
  BorrowListItemDivider,
  BorrowListItemWrapper,
  BorrowListTop,
  BorrowListTopLeft,
  BorrowListTopLeftText,
  Caption3,
  LabelMedium,
  NFTStatus,
} from "./BorrowListItem.styled";

interface BorrowListProps {
  item: nftInfo;
}

const BorrowListItem = (props: BorrowListProps) => {
  const { nftId, amount, timeStamp, lockPeriod } = props.item;

  const navigate = useNavigate();

  return (
    <BorrowListItemWrapper onClick={() => navigate(`/loan/${nftId}`)}>
      <BorrowListTop>
        <BorrowListTopLeft>
          {DDayChange(timeStamp, lockPeriod) > 55 ? (
            <NFTStatus type="ongoing" />
          ) : DDayChange(timeStamp, lockPeriod) === 0 ? (
            <NFTStatus type="expired" />
          ) : (
            <NFTStatus type="forthComing" />
          )}
          <BorrowListTopLeftText>
            <Caption3>Token ID</Caption3>
            <p>{nftId}</p>
          </BorrowListTopLeftText>
        </BorrowListTopLeft>

        {/* Not finalized yet */}
        {/* <BorrowButton onClick={() => navigate(`/loan/${nftId}`)}>
          Borrow
          <img src={IcLoanArrow} alt="loan" />
        </BorrowButton> */}
      </BorrowListTop>

      <BorrowListItemDivider />

      <BorrowListBottom>
        <BorrowListBottomTextBottom>
          <Caption3>Principal</Caption3>
          <LabelMedium>{numberCutter(amount)} TON</LabelMedium>
        </BorrowListBottomTextBottom>
        <BorrowListBottomTextBottom>
          <Caption3>Expired date</Caption3>
          <LabelMedium>{expiredDateChanger(timeStamp, lockPeriod, "detail")}</LabelMedium>
        </BorrowListBottomTextBottom>
        <BorrowListBottomTextBottom>
          <Caption3>max LTV.</Caption3>
          <LabelMedium>50%</LabelMedium>
        </BorrowListBottomTextBottom>
      </BorrowListBottom>
    </BorrowListItemWrapper>
  );
};

export default BorrowListItem;
