import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Canvas />
      <Instruction />
    </div>
  );
};

export default Home;
