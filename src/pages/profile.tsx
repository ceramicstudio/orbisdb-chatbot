import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import useStore from "@/zustand/store";
import { Userform } from "../components/userform.component";

const ProfilePage: NextPage = () => {
  const { address } = useAccount();
  const {  orbisSession } = useStore();


  useEffect(() => {
    console.log("Orbis Session:", orbisSession);
  }, [orbisSession, address]);

  return (
    <div className="flex flex-col bg-cover">
      {orbisSession && address ? (
        <>
          <h1 className="text-2xl font-bold text-white text-center mt-6">
            User and Chatbot Profiles
          </h1>
          <br />
          <p className="text-md text-white text-center">
            You must first create profiles for you and your chatbot before
            interacting in the chat or creating context
          </p>
          <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
            <Userform />
          </div>
          <div className="p-6 bg-white/5 border-t border-[#363739]">
            <div className="max-w-4xl mx-auto"></div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center flex-col space-y-2.5">
          <>
            <p className="text-lg md:text-2xl lg:text-3xl font-medium text-white">
              Sign in with MetaMask to join the chat!
            </p>
            <p>
              <a
                href="https://composedb.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 transition hover:text-[#4a9c6d]/100"
              >
                Powered by ComposeDB &amp; OpenAI Live Queries
              </a>
            </p>
          </>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
