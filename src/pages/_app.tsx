import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { Navbar } from "@/components/navbar";
import { env } from "@/env";

const PROJECT_ID = env.NEXT_PUBLIC_PROJECT_ID ?? "";

const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId: PROJECT_ID });
createWeb3Modal({ wagmiConfig, projectId: PROJECT_ID, chains });

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <>
        <Navbar />
        <Component {...pageProps} ceramic />
      </>
    </WagmiConfig>
  );
}
