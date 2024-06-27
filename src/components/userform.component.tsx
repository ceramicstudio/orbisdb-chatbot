import { useState, useEffect } from "react";
import useStore from "@/zustand/store";
import { type Profile } from "@/utils/types";
import styles from "@/styles/profile.module.scss";
import { useAccount } from "wagmi";
import { env } from "@/env";

const PROFILE_ID = env.NEXT_PUBLIC_PROFILE_ID ?? "";
const CONTEXT_ID = env.NEXT_PUBLIC_CONTEXT_ID ?? "";

export const Userform = () => {
  const { address } = useAccount();
  const { orbis, orbisSession, setOrbisSession } = useStore();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [robotProfile, setRobotProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [robotLoading, setRobotLoading] = useState<boolean>(false);

  const getProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const user = await orbis.getConnectedUser();
      console.log(user);
      const profile = orbis
        .select("controller", "name", "username", "emoji", "actor")
        .from(PROFILE_ID)
        .where({ actor: ["human"] })
        .context(CONTEXT_ID);
      const profileResult = await profile.run();
      if (profileResult.rows.length) {
        console.log(profileResult.rows[0]);
        setProfile(profileResult.rows[0] as Profile);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getRobotProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const profile = orbis
        .select("controller", "name", "username", "emoji", "actor")
        .from(PROFILE_ID)
        .where({ actor: ["robot"] })
        .context(CONTEXT_ID);
      const profileResult = await profile.run();
      console.log(profileResult);
      if (profileResult.rows.length) {
        setRobotProfile(profileResult.rows[0] as Profile);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateProfile = async (): Promise<void> => {
    try {
      await orbis.getConnectedUser();
      setLoading(true);
      console.log(orbis);
      const updatequery = await orbis
        .insert(PROFILE_ID)
        .value({
          name: profile?.name,
          username: profile?.username,
          emoji: profile?.emoji,
          actor: "human",
        })
        .context(CONTEXT_ID)
        .run();

      if (updatequery.content) {
        alert("Updated profile.");
        setProfile(updatequery.content);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateRobotProfile = async (): Promise<void> => {
    try {
      setRobotLoading(true);
      await orbis.getConnectedUser();
      const updatequery = await orbis
        .insert(PROFILE_ID)
        .value({
          name: robotProfile?.name,
          username: robotProfile?.username,
          emoji: robotProfile?.emoji,
          actor: "robot",
        })
        .context(CONTEXT_ID)
        .run();

      console.log(updatequery);
      if (updatequery.content) {
        alert("Updated robot profile.");
        setRobotProfile(updatequery.content);
      }

      setRobotLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orbisSession && address) {
      void getProfile();
      void getRobotProfile();
    }
  }, [orbisSession, address]);

  return (
    <div>
      <div className="content">
        <div className={styles.formGroup}>
          <div className="">
            <label className="">Name</label>
            <input
              className=""
              type="text"
              defaultValue={profile?.name ?? ""}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Username</label>
            <input
              type="text"
              defaultValue={profile?.username ?? ""}
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Emoji</label>
            <input
              type="text"
              defaultValue={profile?.emoji ?? ""}
              onChange={(e) => {
                setProfile({ ...profile, emoji: e.target.value });
              }}
              maxLength={2}
            />
          </div>
          <div className="">
            <button
              disabled={!orbisSession}
              style={{
                backgroundColor: "grey",
                borderRadius: "5px",
                padding: "5px",
                margin: "10% 0",
              }}
              onClick={() => {
                void updateProfile();
              }}
            >
              {loading ? "Loading..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className={styles.formGroup}>
          <div className="">
            <label className="">Name</label>
            <input
              className=""
              type="text"
              defaultValue={robotProfile?.name ?? ""}
              onChange={(e) => {
                setRobotProfile({ ...robotProfile, name: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Username</label>
            <input
              type="text"
              defaultValue={robotProfile?.username ?? ""}
              onChange={(e) => {
                setRobotProfile({
                  ...robotProfile,
                  username: e.target.value,
                });
              }}
            />
          </div>
          <div className="">
            <label>Emoji</label>
            <input
              type="text"
              defaultValue={robotProfile?.emoji ?? ""}
              onChange={(e) => {
                setRobotProfile({ ...robotProfile, emoji: e.target.value });
              }}
              maxLength={2}
            />
          </div>
          <div className="">
            <button
              disabled={!orbisSession}
              style={{
                backgroundColor: "grey",
                borderRadius: "5px",
                padding: "5px",
                margin: "10% 0",
              }}
              onClick={() => {
                void updateRobotProfile();
              }}
            >
              {robotLoading ? "Loading..." : "Update ChatBot Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
