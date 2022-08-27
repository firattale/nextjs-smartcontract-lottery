import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import React from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = React.useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = React.useState("0");
  const [recentWinner, setRecentWinner] = React.useState("0");
  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
  });
  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numberOfPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  React.useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = (tx) => {
    dispatch({
      type: "info",
      message: "Transaction complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  return (
    <>
      {raffleAddress ? (
        <>
          <button
            onClick={async function () {
              await enterRaffle({ onSuccess: handleSuccess, onError: (err) => console.warn(err) });
            }}
          >
            Enter Raffle
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
          <div>The current number of players is: {numberOfPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </>
      ) : (
        <div>Please connect to a supported chain Rinkeby or Hardhat Local </div>
      )}
    </>
  );
}
