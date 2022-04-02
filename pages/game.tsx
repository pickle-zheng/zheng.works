import type { NextPage } from "next";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "./game.module.css";

const Game: NextPage = () => {
  return (
    <div className={styles.container}>
      <Canvas />
      <Instruction />
    </div>
  );
};

export default Game;
