import React, { useEffect, useRef, useState } from "react";
import { CarPool } from "../../utils/Carpool";
import io from "socket.io-client";

import styles from "./Canvas.module.css";

let socket: any;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [typingMessage, setTyping] = useState(false);

  const [carpool, setCarpool] = useState<CarPool>();

  const socketInitializer = async (canvasRef: any): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected", socket.id);
      setCarpool(new CarPool(canvasRef, socket));
    });
  };

  useEffect(() => {
    socketInitializer(canvasRef);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("car-connected", (id: any) => {
        console.log("connected", id);
        if (carpool) carpool.addCar(id);
      });

      socket.on("car-disconnect", (id: any) => {
        console.log("disconnect", id);
        console.log(carpool);
        if (carpool) carpool.removeCar(id);
      });

      socket.on("cars-position", (cars: remoteCarInfo[]) => {
        if (carpool) carpool.updateCarsPosition(cars);
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
  }, [carpool, socket]);

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

    window.addEventListener("keyup", keyboardHandler);
    return () => window.removeEventListener("keyup", keyboardHandler);
  }, [typingMessage, carpool]);

  return (
    <div>
      <canvas ref={canvasRef} />
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
