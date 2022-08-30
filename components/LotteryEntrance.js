import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import React from "react";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";
import { Bell } from "@web3uikit/icons";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = React.useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = React.useState("0");
  const [recentWinner, setRecentWinner] = React.useState("0");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
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
      icon: <Bell fontSize="50px" />,
    });
  };
  const handleSuccess = async (tx) => {
    // onSuccess only checks if the tx successfully transmitted to Metamask that's why we wait 1 confirmation
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  return (
    <div className="p-5">
      {raffleAddress ? (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mb-2"
            onClick={async function () {
              await enterRaffle({ onSuccess: handleSuccess, onError: (err) => console.warn(err) });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
          <div>The current number of players is: {numberOfPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </>
      ) : (
        <div>Please connect to a supported chain Rinkeby or Hardhat Local </div>
      )}
    </div>
  );
}
