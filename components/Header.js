import { ConnectButton } from "@web3uikit/web3";

export default function Header() {
  return (
    <header className="border-b-2 p-5 flex flex-row">
      Decentralized Lottery
      <ConnectButton moralisAuth={false} />
    </header>
  );
}
