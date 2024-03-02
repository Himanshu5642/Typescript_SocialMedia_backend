import { Server } from "http";
import Io, { Socket } from "socket.io";
import { AuthSocket } from "./authSocket.socket";
import handleSockets from "./handleSocketController.socket";
import { getConvertationsByUserId } from "../controller";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";

export const serverSocketConnection = (server: Server) => {
  const io = new Io.Server(server, {
    allowEIO3: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // const pubClient = createClient();
  // const subClient = pubClient.duplicate();

  // Promise.all([pubClient, subClient])
  //   .then(() => {
  //     io.adapter(createAdapter(pubClient, subClient));
  //   })
  //   .catch((e) => console.log(e));

  io.use(async (socket: Socket, next) => {
    await AuthSocket(socket, next);
  });

  io.on("connection", (socket: Socket) => {
    console.log("server socket connected");
    console.log("socket conected user: ", socket.id);
    handleSockets(socket);
    joinConversationsHandler(socket);
    socket.on("disconnect", () => {
      console.log("socket disconnected");
      // io.emit("hello");
    });
  });
};

const joinConversationsHandler = async (socket: Socket) => {
  // @ts-ignore
  let userId = socket.user.id;
  // console.log("userId", userId)
  const rooms = await getConvertationsByUserId(userId);

  rooms.forEach((room) => {
    console.log({ room, user: userId });
    socket.join(room);
  });
};
