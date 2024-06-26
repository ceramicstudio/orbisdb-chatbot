import { useState, useEffect } from "react";
import useStore from "@/zustand/store";
import { Profile } from "@/utils/types";
import styles from "@/styles/profile.module.scss";
import { useAccount } from "wagmi";

export const Userform = () => {
  const { address } = useAccount();
  const { orbis, orbisSession, setOrbisSession } = useStore();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [robotProfile, setRobotProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [robotLoading, setRobotLoading] = useState<boolean>(false);


  const getProfile = async () => {
    setLoading(true);
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
    }
    setLoading(false);
  };

  const getRobotProfile = async () => {
    setLoading(true);
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
    }
  };

  const updateProfile = async () => {
    await orbis.getConnectedUser();
    setLoading(true);
    console.log(orbis);
    const updatequery = await orbis
      .insert("kjzl6hvfrbw6c902s0ymqy0l9ljilieukhv34udk8kuzmf6wliv2k6zzhwg7ykz")
      .value({
        name: profile?.name,
        username: profile?.username,
        emoji: profile?.emoji,
        actor: "human",
      })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      )
      .run();

    if (updatequery.content) {
      alert("Updated profile.");
      setProfile(updatequery.content);
    }

    setLoading(false);
  };

  const updateRobotProfile = async () => {
    setRobotLoading(true);
    await orbis.getConnectedUser();
    const updatequery = await orbis
      .insert("kjzl6hvfrbw6c902s0ymqy0l9ljilieukhv34udk8kuzmf6wliv2k6zzhwg7ykz")
      .value({
        name: robotProfile?.name,
        username: robotProfile?.username,
        emoji: robotProfile?.emoji,
        actor: "robot",
      })
      .context(
        "kjzl6kcym7w8y6yd92n1r55cxxih1johqmygctk2nh8w9jtjtysu31po93115q8"
      )
      .run();

    console.log(updatequery);
    if (updatequery.content) {
      alert("Updated robot profile.");
      setRobotProfile(updatequery.content);
    }

    setRobotLoading(false);
  };

  useEffect(() => {
    if (orbisSession && address) {
      getProfile();
      getRobotProfile();
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
              defaultValue={profile?.name || ""}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Username</label>
            <input
              type="text"
              defaultValue={profile?.username || ""}
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Emoji</label>
            <input
              type="text"
              defaultValue={profile?.emoji || ""}
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
                updateProfile();
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
              defaultValue={robotProfile?.name || ""}
              onChange={(e) => {
                setRobotProfile({ ...robotProfile, name: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label>Username</label>
            <input
              type="text"
              defaultValue={robotProfile?.username || ""}
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
              defaultValue={robotProfile?.emoji || ""}
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
                updateRobotProfile();
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
