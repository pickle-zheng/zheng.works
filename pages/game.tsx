import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas/Canvas";
import GameCanvas from "../components/GameCanvas/GameCanvas";
import Instruction from "../components/Instruction/Instruction";
import SignUp from "../components/SignUp/SignUp";
import styles from "./game.module.css";

export type userInfo = {
  name: string;
  score: number;
  carType: string;
};

const Game: NextPage = () => {
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);
  const [sessionId, setSessionId] = useState<{
    type: string;
    sessionId: string;
  } | null>(null);
  return (
    <div className={styles.container}>
      <Head>
        <title>zz - 🔥</title>
        <meta property='og:title' content='Game - Zheng Works' key='title' />
      </Head>
      {userInfo && sessionId ? (
        <GameCanvas sessionInfo={sessionId} userInfo={userInfo} />
      ) : (
        <SignUp setUserInfo={setUserInfo} setSessionId={setSessionId} />
      )}
      <Instruction />
    </div>
  );
};

export default Game;
