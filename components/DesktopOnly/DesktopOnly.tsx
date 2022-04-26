import React from "react";
import styles from "./DesktopOnly.module.css";

const DesktopOnly = () => {
  return (
    <div className={styles.desktopOnly}>
      <img src='/images/logo.png' alt='logo' />
      <p> I have only built it so far to</p>
      <h1>
        Support
        <br />
        Desktop
        <br />
        Only
      </h1>
      <small>
        None of the threeJS components are loaded here for mobile as memory leak
        has been detected
      </small>
    </div>
  );
};

export default DesktopOnly;
