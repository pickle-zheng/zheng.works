import React, { useRef } from "react";

import styles from "./MiniMap.module.css";

const MiniMap = ({
  carPositions,
  groundSize
}: // socketId
{
  carPositions: any[] | undefined;
  groundSize: { x: number; y: number } | undefined;
  // socketId: string | undefined;
}) => {
  const calculatePosition = ({ x, z }: { x: number; z: number }) => {
    if (groundSize && wrapperRef) {
      const xPixel = Math.floor(
        (x / groundSize.x) * wrapperRef.current?.clientWidth
      );
      const yPixel = Math.floor(
        (z / groundSize.y) * wrapperRef.current?.clientHeight
      );
      return `translate(${-xPixel}px, ${-yPixel}px)`;
    } else {
      return `translate(0px, 0px)`;
    }
  };
  const wrapperRef = useRef<any>(null);
  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.wrapper}>
        {carPositions?.length
          ? carPositions.map((carPosition, i) => (
              <span
                className={styles.hostCar}
                // className={socketId === carPosition.id ? styles.hostCar : ""}
                style={{
                  transform: calculatePosition({
                    x: carPosition.position.x,
                    z: carPosition.position.z
                  })
                }}
                key={i}
              ></span>
            ))
          : null}
      </div>
      <div className={styles.orientations}>
        <div className={styles.north}>N</div>
        <div className={styles.east}>E</div>
        <div className={styles.south}>S</div>
        <div className={styles.west}>W</div>
      </div>
    </div>
  );
};

export default MiniMap;
