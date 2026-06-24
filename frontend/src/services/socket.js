import { io } from "socket.io-client";

const SOCKET_URL =
  "https://queuecure-backend-j3cg.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
});