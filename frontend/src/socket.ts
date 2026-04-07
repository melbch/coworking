import { io, type Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_API_URL, {
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