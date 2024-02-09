import { Server } from "http";
import Io, { Socket } from "socket.io";
import { AuthSocket } from "./authSocket.socket";
import handleSockets from "./handleSocketController.socket";

export const serverSocketConnection = (server: Server) => {
  const io = new Io.Server(server, {
    allowEIO3: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    await AuthSocket(socket, next);
  });

  io.on("connection", (socket: Socket) => {
    console.log("server socket connected");
    console.log("socket conected user: ", socket.id);
    handleSockets(socket);
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
};
