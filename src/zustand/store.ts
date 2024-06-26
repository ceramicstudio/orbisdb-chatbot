import { create } from "zustand";
import { type GetWalletClientResult } from "@wagmi/core";
import { OrbisDB, OrbisConnectResult } from "@useorbis/db-sdk";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";

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
    const auth = new OrbisEVMAuth(window.ethereum);
    // Authenticate, but don't persist the session in localStorage
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
        env: "did:pkh:eip155:1:0x514e3b94f0287caf77009039b72c321ef5f016e6",
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
