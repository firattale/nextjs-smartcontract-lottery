import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <header>
      Decentralized Lottery
      <ConnectButton moralisAuth={false} />
    </header>
  );
}
