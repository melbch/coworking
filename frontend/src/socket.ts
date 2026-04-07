import { io, type Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000", {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
});

socket.on("connect", () => {
    console.log("Connected to socket:", socket.id)
});

socket.on("disconnect", () => {
    console.log("Disconnected from socket")
});

export default socket;