import React, { useEffect, useRef, useState } from "react";
import { CarPool } from "../../utils/physics";
import io from "socket.io-client";
import uniqid from "uniqid";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let socket: any;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let carpool: CarPool;
  // @ts-ignore
  useEffect(() => socketInitializer(canvasRef), [canvasRef]);

  const socketInitializer = async (canvasRef: any): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected", socket.id);
      carpool = new CarPool(canvasRef, socket);
    });

    socket.on("car-connected", (id: any) => {
      console.log("connected", id);
      carpool.addCar(id);
    });

    socket.on("car-disconnect", (id: any) => {
      console.log("disconnect", id);
      carpool.removeCar(id);
    });

    socket.on("cars-position", (cars: remoteCarInfo[]) => {
      carpool.updateCarsPosition(cars);
    });
  };
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
