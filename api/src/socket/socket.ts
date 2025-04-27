import { Server, Socket } from "socket.io";
import http from "http";
import { socketAuth } from "./middleware/socketAuth";

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (receiverId: number) => {
  return userSocketMap[receiverId];
};

const io = new Server(http.createServer(), {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export default io;

export const initializeSocket = (server: http.Server) => {
  io.attach(server);

  io.use(socketAuth);

  io.on("connection", (socket: Socket & { user?: any }) => {
    if (socket.user) {
      userSocketMap[socket.user.id] = socket.id;
    }

    socket.on("disconnect", () => {
      if (socket.user) {
        delete userSocketMap[socket.user.id];
      }
    });
  });

  return io;
};
