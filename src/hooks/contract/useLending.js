import { Address, TupleBuilder, contractAddress, toNano } from "@ton/core";

import { NxtonWallet } from "./wrappers/tact_NxtonWallet";
import { NftItem } from "./wrappers/NftItem";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import useTonConnect from "./useTonConnect";

function lend() {
  const contractAddress = `${import.meta.env.VITE_LENDING_ADDRESS}`;
  const client = useTonClient();
  const { sender, address } = useTonConnect();

  return {
    address: contractAddress,
    sendMessage: async (nftAddress, data) => {
      if (nftAddress) {
        const nftItem = client.open(NftItem.createFromAddress(nftAddress));
        await nftItem.sendTransferWithData(sender, data);
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
  }, [client, sender]);

  return {
    address: contractAddress,
    nxtonWalletAddress: nxtonWallet.address,
    sendMessage: async (value, data) => {
      await nxtonWallet.send(sender, { value: value }, data);
    },
    getNxtonAmount: async () => {
      try {
        const result = await nxtonWallet.getGetWalletData();
        return result.balance;
      } catch (error) {
        return -1;
      }
    },
  };
}

export { lend, repay };
