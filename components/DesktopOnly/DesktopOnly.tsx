import React from "react";
import styles from "./DesktopOnly.module.css";
const DesktopOnly = () => {
  return (
    <div className={styles.desktopOnly}>
      <img src='/images/logo.png' />
      <p> I've only built it so far to</p>

      <h1>
        Support
        <br />
        Desktop
        <br />
        Only
      </h1>
    </div>
  );
};

export default DesktopOnly;
