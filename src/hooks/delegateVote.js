// import useProposals from "./hooks/useProposals";
import { useCallback } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";

import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";

const useHandleDelegate = (to) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return console.error("Wrong network");
    if (!isAddress(to)) return console.error("Invalid address");

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.delegate(to);

      const receipt = transaction.wait();

      console.log(transaction, receipt);

      if (receipt.status) {
        return console.log("giveExtraRightToVote successful!");
      }

      console.log("giveExtraRightToVote failed!");
    } catch (error) {
      console.log("this error", error);
    }
  }, [to, chainId, walletProvider]);
};

export default useHandleDelegate;
