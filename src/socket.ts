import { IncomingMessage, Server, ServerResponse } from "node:http";

import { Server as SocketIOServer } from "socket.io";

import { Express } from "express";

const webSocket = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
  app: Express
) => {
  const io = new SocketIOServer(server, { path: "/socket.io" });
  app.set("io", io);
  io.on("connection", (socket) => {
    // 웹 소켓 연결 시
  });
};

export default webSocket;
