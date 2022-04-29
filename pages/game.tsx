import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas/Canvas";
import GameCanvas from "../components/GameCanvas/GameCanvas";
import Instruction from "../components/Instruction/Instruction";
import SignUp from "../components/SignUp/SignUp";
import styles from "./game.module.css";
import userStore from "../stores/userStore";

export type userInfo = {
  name: string;
  score: number;
  carType: string;
};

const Game: NextPage = () => {
  const userInfo = userStore((state) => state.userInfo);
  return (
    <div className={styles.container}>
      <Head>
        <title>zz - 🔥</title>
        <meta property='og:title' content='Game - Zheng Works' key='title' />
      </Head>
      <SignUp hide={userInfo !== null} />
      {userInfo && <GameCanvas userInfo={userInfo} />}
      <Instruction />
    </div>
  );
};

export default Game;
