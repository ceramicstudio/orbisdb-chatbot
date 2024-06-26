import { useEffect, useState, useRef } from "react";
import useStore from "@/zustand/store";
import { PostProps, Profile } from "@/utils/types";
import { Message } from "@/components/message";
import { useAccount } from "wagmi";

export const MessageList = () => {
  const [posts, setPosts] = useState<PostProps[] | []>([]);
  const [data, setData] = useState("");
  const [body, setBody] = useState("");
  const [write, setWrite] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<PostProps>();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [robotProfile, setRobotProfile] = useState<Profile | undefined>();
  const messageRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { orbis, orbisSession, setOrbisSession } = useStore();

  const getProfile = async () => {
    const user = await orbis.getConnectedUser();
    console.log(user);
    const profile = await orbis
      .select("controller", "name", "username", "emoji", "actor")
      .from("kjzl6hvfrbw6c902s0ymqy0l9ljilieukhv34udk8kuzmf6wliv2k6zzhwg7ykz")
      .where({ actor: ["human"] })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      );
    const profileResult = await profile.run();
    if (profileResult.rows.length) {
      console.log(profileResult.rows[0]);
      setProfile(profileResult.rows[0] as Profile);
    } else {
      window.location.href = "/profile";
    }
    await getRobotProfile(profileResult.rows[0] as Profile);
  };

  const getRobotProfile = async (uProfile: Profile) => {
    const profile = await orbis
      .select("controller", "name", "username", "emoji", "actor")
      .from("kjzl6hvfrbw6c902s0ymqy0l9ljilieukhv34udk8kuzmf6wliv2k6zzhwg7ykz")
      .where({ actor: ["robot"] })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      );
    const profileResult = await profile.run();
    console.log(profileResult);
    if (profileResult.rows.length) {
      setRobotProfile(profileResult.rows[0] as Profile);
      await getRecentMessagesQuery(uProfile, profileResult.rows[0] as Profile);
    } else {
      window.location.href = "/profile";
    }
  };

  /*
  Get only messages relevant to the user and the bot using filters
  */
  const getRecentMessagesQuery = async (
    uProfile: Profile,
    rProfile: Profile
  ) => {
    await orbis.getConnectedUser();
    const messages = await orbis
      .select("tag", "body", "created", "edited")
      .from("kjzl6hvfrbw6c8xxo27q5l8of72o7snzbdvlad3jj06h0epfeypg3e10aya5dby")
      // .where({ controller: [authorId, robotDID] })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      );
    const messageResult = await messages.run();
    console.log(messageResult);
    console.log(messageResult.rows, "81");
    if (messageResult.rows.length && uProfile) {
      const newPosts = messageResult.rows.map((edge) => ({
        // id: edge.node.id,
        body: edge.body,
        profile: edge.tag === "user" ? uProfile : rProfile,
        tag: edge.tag,
        created: edge.created,
      })) as PostProps[];
      setPosts(newPosts);
      return messageResult.rows;
    }
  };

  const createPost = async (thisPost: string) => {
    await orbis.getConnectedUser();
    const query = await orbis
      .insert("kjzl6hvfrbw6c8xxo27q5l8of72o7snzbdvlad3jj06h0epfeypg3e10aya5dby")
      .value({
        body: thisPost,
        created: new Date().toISOString(),
        tag: "user",
        edited: new Date().toISOString(),
      })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      )
      .run();
    console.log(query);

    if (query.content && profile) {
      const createdPost: PostProps = {
        id: query.id,
        body: query.content.body,
        profile,
        tag: query.content.tag,
        created: query.content.created,
        authorId: query.controller,
      };
      return createdPost;
    }
  };

  /* a response is triggered each time we sent a message
  which then hits our api found in /pages/api/ai, and stream the response
  back to the frontend */
  const triggerResponse = async (message: string, inputPost: PostProps) => {
    try {
      const messages: { role: string; content: string }[] = [];
      posts.forEach((post) => {
        messages.push({
          role: post.profile.actor === "robot" ? "assistant" : "user",
          content: post.body,
        });
      });
      const response = await fetch("/api/chat/ai", {
        method: "POST",
        body: JSON.stringify({
          message,
          messages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok || !response.body) {
        throw response.statusText;
      }
      const blankPost: PostProps = {
        id: "",
        body: "",
        profile: {
          username: robotProfile?.username,
          name: robotProfile?.name,
          actor: robotProfile?.actor,
          emoji: robotProfile?.emoji,
        },
        tag: "bot",
        created: new Date().toISOString(),
      };
      setNewPost(blankPost);
      setWrite(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let str = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          await orbis.getConnectedUser();
          const query = await orbis
            .insert(
              "kjzl6hvfrbw6c8xxo27q5l8of72o7snzbdvlad3jj06h0epfeypg3e10aya5dby"
            )
            .value({
              body: str,
              created: new Date().toISOString(),
              tag: "bot",
              edited: new Date().toISOString(),
            })
            .context(
              "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
            )
            .run();
          console.log(query);

          if (query.content && robotProfile) {
            const createdPost: PostProps = {
              id: query.id,
              body: query.content.body,
              profile: robotProfile,
              tag: query.content.tag,
              created: query.content.created,
              authorId: query.controller,
            };
            console.log(posts);
            setWrite(false);
            setNewPost(undefined);
            setPosts([...posts, inputPost, createdPost]);
            setData("");
          }
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        setData((prevValue) => `${prevValue.concat(decodedChunk)}`);
        str = str.concat(decodedChunk);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (orbisSession && address) {
      getProfile();
    }
  }, [orbisSession, address]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [posts, write]);

  return (
    <>
      <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
              {posts.length > 0 &&
                posts.map((post, index) => (
                  <Message
                    key={index}
                    profile={post.profile}
                    body={post.body}
                    tag={post.tag}
                    created={post.created}
                    id={post.id}
                    authorId={post.authorId}
                  />
                ))}
              {write && newPost && (
                <Message
                  key={newPost?.id}
                  tag={newPost.tag}
                  profile={newPost.profile}
                  body={data}
                  created={newPost.created}
                  id={newPost.id}
                  authorId={newPost.authorId}
                />
              )}
              <div ref={messageRef}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/5 border-t border-[#363739]">
        <div className="max-w-4xl mx-auto">
          <form
            onClick={async (e) => {
              e.preventDefault();
              if (body) {
                console.log(body);
                const resultPost = await createPost(body);
                if (resultPost) {
                  setPosts([...posts, resultPost]);
                }
                if (resultPost) {
                  await triggerResponse(body, resultPost);
                }
                setBody("");
              }
            }}
            className="flex items-center space-x-3"
          >
            <input
              autoFocus
              id="message"
              name="message"
              placeholder="Write a message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 h-12 px-3 rounded bg-[#222226] border border-[#222226] focus:border-[#222226] focus:outline-none text-white placeholder-white"
            />
            <button
              type="submit"
              className="bg-[#222226] rounded h-12 font-medium text-white w-24 text-lg border border-transparent hover:bg-[#363739] transition"
              disabled={!body || !orbisSession}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
