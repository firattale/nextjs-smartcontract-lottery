import { useMoralis } from "react-moralis";
import React from "react";

export default function Header() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
    useMoralis();
  React.useEffect(() => {
    if (isWeb3Enabled) return;
    if (window.localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);
  React.useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  return (
    <header>
      {account ? (
        <div>Account: {account}</div>
      ) : (
        <button
          disabled={isWeb3EnableLoading}
          onClick={async () => {
            await enableWeb3();
            window.localStorage.setItem("connected", "injected");
          }}
        >
          Connect
        </button>
      )}
    </header>
  );
}
