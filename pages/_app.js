import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { NotificationProvider } from "@web3uikit/core";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={"one"} initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
