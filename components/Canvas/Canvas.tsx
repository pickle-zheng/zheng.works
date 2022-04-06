import React, { useEffect, useRef, useState } from "react";
import { CarPool } from "../../utils/Carpool";
import { PortFolioPool } from "../../utils/PortfolioPool";
import io from "socket.io-client";

import styles from "./Canvas.module.css";
import MiniMap from "../MiniMap/MiniMap";

let socket: any;

const Canvas = ({ mode }: { mode: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [typingMessage, setTyping] = useState(false);

  const [carpool, setCarpool] = useState<CarPool | PortFolioPool>();

  const [carPositions, setCarPositions] = useState<any[]>();

  const socketInitializer = async (canvasRef: any): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected", socket.id);
      if (mode === "portfolio") {
        setCarpool(new PortFolioPool(canvasRef, socket));
      } else {
        setCarpool(new CarPool(canvasRef, socket));
      }
    });
  };

  useEffect(() => {
    socketInitializer(canvasRef);
  }, []);

  useEffect(() => {
    const manager = carpool?.loaderManager;
    if (manager) {
      manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log(
          "Started loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
        );
      };

      manager.onLoad = function () {
        console.log("Loading complete!");
      };

      manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log(
          "Loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
        );
      };

      manager.onError = function (url) {
        console.log("There was an error loading " + url);
      };
    }
  }, [carpool]);

  useEffect(() => {
    if (socket) {
      socket.on("car-connected", (id: any) => {
        console.log("connected", id);
        // if (carpool) carpool.addCar(id, "pickup");
      });

      socket.on("car-disconnect", (id: any) => {
        console.log("disconnect", id);
        const newCarPositions = carPositions?.filter((car) => car.id !== id);
        if (carpool) carpool.removeCar(id);
        setCarPositions(newCarPositions);
      });

      socket.on("cars-position", (cars: remoteCarInfo[]) => {
        if (carpool) carpool.updateCarsPosition(cars);
        setCarPositions(cars);
      });

      socket.on("new-message", (message: any) => {
        console.log("new-message", message);
        if (carpool) carpool.addMessage(message);
      });
    }
    return () => {
      socket.off("car-connected");
      socket.off("car-disconnect");
      socket.off("cars-position");
      socket.off("new-message");
    };
  }, [carpool, socket, carPositions]);

  useEffect(() => {
    if (carpool) carpool.updateTypingStatus(typingMessage);
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.keyCode === 13 || event.key === "Enter") {
        if (typingMessage === false) {
          setTyping(true);
          inputRef.current?.focus({ preventScroll: true });
        } else {
          setTyping(false);
        }
      }
    };
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.keyCode === 9 || event.key === "Tab") {
        event.preventDefault();
      }
    };

    window.addEventListener("keyup", keyboardHandler);
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keyup", keyboardHandler);
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [typingMessage, carpool]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <MiniMap
        carPositions={carPositions}
        groundSize={carpool?.groundSize}
        socketId={socket?.id}
      />
      <form
        className={`${styles.form} ${typingMessage && styles.formTyping}`}
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            message: { value: string };
          };
          const message = target.message.value;
          if (message.length > 0)
            socket.emit("message", { message: message, id: socket.id });
          target.message.value = "";
          inputRef.current?.blur();
        }}
      >
        <input type='text' id='message' name='message' ref={inputRef} />
      </form>
    </div>
  );
};

export default Canvas;
