import type { NextPage } from "next";
import Head from "next/head";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "./Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zheng Works - Hello World</title>
        <meta
          property='og:title'
          content='Zheng Works - Hello World'
          key='title'
        />
      </Head>
      <h1>Hello World</h1>
    </div>
  );
};

export default Home;
