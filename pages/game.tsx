import type { NextPage } from "next";
import Head from "next/head";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "./game.module.css";

const Game: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Game - Zheng Works</title>
        <meta property='og:title' content='Game - Zheng Works' key='title' />
      </Head>
      <Canvas mode='game' />
      <Instruction />
    </div>
  );
};

export default Game;
