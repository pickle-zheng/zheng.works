import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import { pageview } from "../utils/ga";
import styles from "./portfolio.module.css";

const Home: NextPage = () => {
  useEffect(() => {
    pageview("/portfolio-index");
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>zz</title>
        <meta property='og:title' content='Game - Zheng Works' key='title' />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-D3MKH4NHZ0`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-D3MKH4NHZ0');
            `
          }}
        />
      </Head>
      <Canvas mode='portfolio' />
      <Instruction />
    </div>
  );
};

export default Home;
