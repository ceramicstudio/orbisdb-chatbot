import { create } from "zustand";
import { type GetWalletClientResult } from "@wagmi/core";
import {
  type IEVMProvider,
  OrbisDB,
  type OrbisConnectResult,
} from "@useorbis/db-sdk";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { env } from "@/env";

const ENV_ID = env.NEXT_PUBLIC_ENV_ID ?? "";

declare global {
  interface Window {
    ethereum?: IEVMProvider;
  }
}

type Store = {
  orbis: OrbisDB;
  orbisSession?: OrbisConnectResult | undefined;
  // setOrbisSession returns a promise
  setAuth: (
    wallet: GetWalletClientResult | undefined
  ) => Promise<OrbisConnectResult | undefined>;
  setOrbisSession: (session: OrbisConnectResult | undefined) => void;
};

const StartOrbisAuth = async (
  walletClient: GetWalletClientResult,
  orbis: OrbisDB
): Promise<OrbisConnectResult | undefined> => {
  if (walletClient) {
    const auth = new OrbisEVMAuth(window.ethereum!);
    // Authenticate - this option persists the session in local storage
    const authResult: OrbisConnectResult = await orbis.connectUser({
      auth,
    });
    if (authResult.session) {
      console.log("Orbis Auth'd:", authResult.session);
      return authResult;
    }
  }

  return undefined;
};

const useStore = create<Store>((set) => ({
  orbis: new OrbisDB({
    ceramic: {
      gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
    },
    nodes: [
      {
        gateway: "https://studio.useorbis.com",
        env: ENV_ID,
      },
    ],
  }),
  orbisSession: undefined,
  setAuth: async (wallet) => {
    if (wallet) {
      try {
        const auth = await StartOrbisAuth(wallet, useStore.getState().orbis);
        set((state: Store) => ({
          ...state,
          orbisSession: auth,
        }));
        return auth;
      } catch (err) {
        console.error(err);
      }
    } else {
      set((state: Store) => ({
        ...state,
        session: undefined,
      }));
    }
  },
  setOrbisSession: (session) =>
    set((state: Store) => ({
      ...state,
      orbisSession: session,
    })),
}));

export default useStore;
