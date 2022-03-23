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
      socket.on("car-position-change", (msg) => {
        const carIndex = cars.findIndex((car) => car.id === msg.id);
        if (carIndex === -1) {
          cars.push(msg);
        } else {
          cars[carIndex] = msg;
        }
        socket.broadcast.emit("cars-position", cars);
        // console.log(cars);
      });
      socket.on("disconnect", () => {
        console.log("car disconnected", socket.id);
        const carIndex = cars.findIndex((car) => car.id === socket.id);
        if (carIndex !== -1) {
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
