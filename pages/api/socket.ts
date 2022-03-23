import { Server } from "socket.io";

const SocketHandler = (req: any, res: any) => {
  const cars: {
    id: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
    wheelAngle: number;
    forwardVelocity: number;
  }[] = [];
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("car connected", socket.id);
      socket.broadcast.emit("car-connected", socket.id);
      socket.on("car-position-change", (msg) => {
        const carIndex = cars.findIndex((car) => car.id === msg.id);
        if (carIndex === -1) {
          cars.push(msg);
        } else {
          cars[carIndex] = msg;
        }
        socket.broadcast.emit("cars-position", cars);
      });

      socket.on("disconnect", () => {
        console.log("car disconnect", socket.id);
        const carIndex = cars.findIndex((car) => car.id === socket.id);
        cars.splice(carIndex, 1);
        socket.broadcast.emit("car-disconnect", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
