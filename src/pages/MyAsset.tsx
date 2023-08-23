import styled from "styled-components";
import MyAssetContent from "../components/myAsset";
import IcBack from "../assets/icons/ic_back.svg";

const MyAsset = () => {
  return (
    <MyAssetWrapper>
      <MyAssetHeaderBox>
        <BackImageBox>
          <BackImg
            src={IcBack}
            onClick={() => window.history.back()}
            width={10}
          />
        </BackImageBox>
        <MyAssetHeaderTop>MY asset</MyAssetHeaderTop>
      </MyAssetHeaderBox>
      <MyAssetContent />
    </MyAssetWrapper>
  );
};

export default MyAsset;

const MyAssetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;

  position: relative;

  padding: 2.9rem 1.6rem 1.4rem 1.6rem;
`;

const MyAssetHeaderBox = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
`;

const MyAssetHeaderTop = styled.span`
  padding-top: 1rem;

  color: #45464f;
  ${({ theme }) => theme.fonts.Telegram_Title_3_1};
`;

const BackImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  width: 3.4rem;
  height: 3.4rem;
  margin-right: 10.2rem;

  border-radius: 50%;
  background-color: #f9f9ff;
  box-shadow: 0px 0px 20px 0px #e1e4e6;

  cursor: pointer;
`;

const BackImg = styled.img``;
