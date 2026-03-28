import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants.js";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/**
 * Socket event handlers
 */
export const setupGridSocketListeners = (callbacks) => {
  const { onGridData, onBlockUpdate, onBlockFailed } = callbacks;

  socket.on("grid:data", onGridData);
  socket.on("block:update", onBlockUpdate);
  socket.on("block:failed", onBlockFailed);
};

export const cleanupGridSocketListeners = () => {
  socket.off("grid:data");
  socket.off("block:update");
  socket.off("block:failed");
};

export const emitGridInit = () => {
  socket.emit("grid:init");
};

export const emitBlockClaim = (blockId) => {
  socket.emit("block:claim", { blockId });
};

export const emitBlockRelease = (blockId) => {
  socket.emit("block:release", { blockId });
};
