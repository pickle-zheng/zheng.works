import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowTurnDown,
  faArrowUp,
  faGripLines,
  faR,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "./Instruction.module.css";
const Instruction = () => {
  const [hide, setHide] = useState(false);
  return (
    <div className={`${styles.container}`}>
      <div
        className={styles.close}
        onClick={() => {
          setHide(!hide);
        }}
      >
        <FontAwesomeIcon icon={hide ? faGripLines : faXmark} />
      </div>
      <div className={`${styles.wrapper} ${hide && styles.hide}`}>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
          <div>Accelerate</div>
        </div>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
          <div>Brake/Reverse</div>
        </div>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div>Turn left</div>
        </div>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <div>Turn right</div>
        </div>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon icon={faR} />
          </div>
          <div>Reset car</div>
        </div>
        <div className={styles.row}>
          <div>
            <FontAwesomeIcon
              icon={faArrowTurnDown}
              style={{ transform: "rotate(90deg)" }}
            />
          </div>
          <div>Send a message</div>
        </div>
      </div>
    </div>
  );
};

export default Instruction;
