import {
  getOnlineUsers,
  onlineUser,
  sendMessageController,
} from "../controller";
import { IMessage } from "../interfaces";
import { Socket } from "socket.io";

export default function handleSockets(socket: Socket) {
  socket.on("hello", () => {
    console.log("hello");
  });

  socket.on("sendMessage", (data: IMessage) => {
    sendMessageController(data, socket);
  });

  socket.on("readMessage", (data: IMessage) => {});

  socket.on("userOnline", () => onlineUser(socket));

  // socket.on("onlineUsers", () => getOnlineUsers(socket));
}
