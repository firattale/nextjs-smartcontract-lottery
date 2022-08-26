import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import React from "react";
import { ethers } from "ethers";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = React.useState("0");

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  async function updateUI() {
    const entranceFeeFromCall = await getEntranceFee();
    const fee = ethers.utils.formatUnits(entranceFeeFromCall, "ether");
    setEntranceFee(fee);
  }

  React.useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      {raffleAddress ? (
        <>
          <div>Entrance Fee: {entranceFee} ETH</div>
          <div>The current number of players is: {"numberOfPlayers"}</div>
          <div>The most previous winner was: {"recentWinner"}</div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </>
  );
}
