import { Address, TupleBuilder, beginCell, toNano } from "@ton/core";

import { NxtonWallet } from "./wrappers/tact_NxtonWallet";
import { NftItem } from "./wrappers/NftItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import useTonConnect from "./useTonConnect";

const LEND_FEE = toNano("0.11");
const LEND_FORWARD = toNano("0.05");
const REPAY_FEE = toNano("0.1");
const REPAY_FORWARD = toNano("0.05");

function lend() {
  const contractAddress = `${import.meta.env.VITE_LENDING_ADDRESS}`;
  const client = useTonClient();
  const { sender, address } = useTonConnect();

  return {
    contractAddress: contractAddress,
    sendMessage: async nftAddress => {
      if (nftAddress) {
        const nftItem = client.open(NftItem.createFromAddress(nftAddress));
        const param = {
          value: LEND_FEE,
          queryId: BigInt(Date.now()),
          newOwnerAddress: Address.parse(contractAddress),
          responseDestination: Address.parse(address),
          forwardAmount: LEND_FORWARD,
          forwardPayload: beginCell().storeUint(8, 8),
        };
        await nftItem.sendTransferWithData(sender, param);
      } else {
        return () => {};
      }
    },
  };
}

function repay() {
  const client = useTonClient();
  const { sender, address } = useTonConnect();
  const nxtonMasterAddress = `${import.meta.env.VITE_NXTON_ADDRESS}`;
  const contractAddress = `${import.meta.env.VITE_LENDING_ADDRESS}`;

  let nxtonWallet = useAsyncInitialize(async () => {
    if (!client) return;
    try {
      const param = new TupleBuilder();
      param.writeAddress(Address.parse(address));
      const walletAddress = (
        await client.runMethod(Address.parse(nxtonMasterAddress), "get_wallet_address", param.build())
      ).stack.readAddress();
      const nxtonWallet = client.open(NxtonWallet.fromAddress(walletAddress));
      return nxtonWallet;
    } catch (error) {
      return null;
    }
  }, [client]);

  return {
    contractAddress: contractAddress,
    sendMessage: async param => {
      const data = {
        $$type: "TokenTransfer",
        queryId: BigInt(Date.now()),
        amount: param.amount,
        destination: Address.parse(contractAddress),
        response_destination: Address.parse(address),
        custom_payload: null,
        forward_ton_amount: REPAY_FORWARD,
        forward_payload: beginCell().storeAddress(param.nft).asSlice(),
      };

      await nxtonWallet.send(sender, { value: REPAY_FEE }, data);
    },
    getNxtonAmount: async () => {
      try {
        const balance = await nxtonWallet.getBalance();
        return balance;
      } catch (error) {
        return -1;
      }
    },
  };
}

export { lend, repay };
