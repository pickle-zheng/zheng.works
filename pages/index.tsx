import type { NextPage } from "next";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "./Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Hello World</h1>
    </div>
  );
};

export default Home;
