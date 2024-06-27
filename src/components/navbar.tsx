import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import useStore from "@/zustand/store";
import { type OrbisConnectResult, type SiwxAttestation } from "@useorbis/db-sdk";

export function Navbar() {
  const [loggedIn, setLoggedIn] = useState<boolean | string>("loading");
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { setAuth, setOrbisSession } = useStore();

  useEffect(() => {
    if (localStorage.getItem("orbis:session")) {
      const attestation = (JSON.parse(localStorage.getItem("orbis:session") ?? "{}") as OrbisConnectResult).session.authAttestation as SiwxAttestation;
      const expTime = attestation.siwx.message.expirationTime;
      //@ts-expect-error - TS doesn't know about the expirationTime field
      if (expTime > Date.now()) {
        localStorage.removeItem("orbis:session");
        setLoggedIn(false);
      } else {
        setOrbisSession(
          JSON.parse(localStorage.getItem("orbis:session") ?? "{}") as OrbisConnectResult
        );
        setLoggedIn(true);
      }
    }

    if (address && walletClient && !loggedIn) {
      setAuth(walletClient)
        .then((auth) => {
          if (auth) {
            console.log("Orbis Auth'd:", auth.session);
            setLoggedIn(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return () => {
      setLoggedIn(false);
      setOrbisSession(undefined);
    };
  }, [address, walletClient, loggedIn, setAuth, setOrbisSession]);

  return (
    <header className="p-6 bg-white/5 border-b border-[#363739]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <p className="inline-flex items-center space-x-3">
              <a
                href="https://composedb.js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://blog.ceramic.network/content/images/2020/11/ceramic-no-shadow.png"
                  alt="ComposeDB"
                  className="w-7 h-7"
                />
              </a>
              <button
                className="text-white font-bold text-xl"
                onClick={() => (window.location.href = "/")}
              >
                {" "}
                OrbChat
              </button>
            </p>
          </div>
          {address && loggedIn && loggedIn !== "loading" && (
            <div className="flex space-x-1 items-center w-2/3 justify-end">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Edit Profile
              </button>
            </div>
          )}
          <div className="flex items-center">
            <w3m-button size="sm" balance="hide" />
          </div>
        </div>
      </div>
    </header>
  );
}
