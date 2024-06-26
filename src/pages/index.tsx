import { useAccount } from "wagmi";
import useStore from "@/zustand/store";
import { MessageList } from "@/components/message-list";

export default function Home() {
  const { address } = useAccount();
  const { orbisSession } = useStore();

  return (
    <div className="flex flex-col bg-cover">
      {orbisSession && address ? (
        <MessageList />
      ) : (
        <div className="h-full flex items-center justify-center flex-col space-y-2.5">
          <>
            <p className="text-lg md:text-2xl lg:text-3xl font-medium text-white">
              Sign in to join the chat!
            </p>
            <p>
              <a
                href="https://composedb.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 transition hover:text-[#4a9c6d]/100"
              >
                Powered by OrbisDB &amp; OpenAI Live Queries
              </a>
            </p>
          </>
        </div>
      )}
    </div>
  );
}
