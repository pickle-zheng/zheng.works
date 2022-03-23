import React, { useEffect, useRef, useState } from "react";
import { physics } from "../../utils/physics";
import io from "socket.io-client";
import uniqid from "uniqid";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let socket: any;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => socketInitializer(canvasRef), [canvasRef]);

  const socketInitializer = async (canvasRef: any): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      const id = uniqid();
      physics(canvasRef, socket, id);
    });
  };
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
