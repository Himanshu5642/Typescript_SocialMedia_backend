import { Socket } from "socket.io";

export default function handleSockets(socket: Socket) {
  socket.on("hello", () => {
    console.log("hello");
  });

  
}
