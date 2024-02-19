import React from "react";
import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <div className={styles.container}>
      <img src='/images/logo.png' />
    </div>
  );
};

export default Logo;
