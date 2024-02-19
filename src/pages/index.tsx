import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Canvas from "../components/Canvas/Canvas";
import Instruction from "../components/Instruction/Instruction";
import styles from "./portfolio.module.css";
import DesktopOnly from "../components/DesktopOnly/DesktopOnly";

const Home: NextPage = (props: any) => {
  const resizeHandler = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
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
      {props.deviceType === "mobile" ? (
        <DesktopOnly />
      ) : (
        <>
          <Canvas mode='portfolio' /> <Instruction />
        </>
      )}
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: {
  req: { headers: { [x: string]: any } };
}) {
  const UA = context.req.headers["user-agent"];
  const isMobile = Boolean(
    UA.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  return {
    props: {
      deviceType: isMobile ? "mobile" : "desktop"
    }
  };
}
