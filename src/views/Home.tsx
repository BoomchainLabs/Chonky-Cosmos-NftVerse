import { useAccount } from "wagmi";

import "./Home.css";
import NotConnected from "./components/blockchain/NotConnected";
import { Text } from "@0xsequence/design-system";
import Connected from "./components/blockchain/Connected";

const Home = () => {
  const { isConnected } = useAccount();

  const Content = () => {
    if (!isConnected) {
      return <NotConnected />;
    }

    return <Connected />;
  };

  return (
    <div>
      {!isConnected && (
        <>
          <h1>Sequence Primary Drop Sale 721 Boilerplate</h1>
          <h2 className="homepage__marginBtNormal">Embedded Wallet</h2>
        </>
      )}
      <Content />
      <footer className="homepage__footer">
        <Text>
          Want to learn more?{" "}
          {/* Read the{" "}
          <a
            href={
              "https://docs.sequence.xyz/solutions/wallets/sequence-kit/overview/"
            }
            target="_blank"
            rel="noreferrer "
          >
            docs
          </a>
          ! */}
          Docs Coming Soon
        </Text>
      </footer>
    </div>
  );
};

export default Home;
