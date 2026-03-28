import * as blockService from "../services/block.service.js";
import { checkClaimRateLimit } from "../utils/rate-limit.js";

export const handleGridSocket = (io, socket) => {
  socket.on("grid:init", async () => {
    try {
      const blocks = await blockService.getGridBlocks();
      socket.emit("grid:data", blocks);
    } catch (err) {
      console.error("[grid:init] Error:", err.message);
      socket.emit("grid:error", { message: "Failed to load grid" });
    }
  });

  socket.on("block:claim", async ({ blockId }) => {
    try {
      if (!socket.user?.id) {
        socket.emit("block:failed", { blockId, reason: "not_authenticated" });
        return;
      }

      const allowed = await checkClaimRateLimit(socket.user.id);
      if (!allowed) {
        socket.emit("block:failed", { blockId, reason: "rate_limited" });
        return;
      }

      const updated = await blockService.claimBlock({
        blockId,
        userId: socket.user.id,
        userColor: socket.user.color,
      });

      io.emit("block:update", {
        ...updated,
        ownerName: socket.user.username,
      });
    } catch (err) {
      const reason = err.reason || "unknown_error";
      const message = err.message || "Failed to claim block";
      console.error(`[block:claim] ${reason}:`, message);
      socket.emit("block:failed", { blockId, reason });
    }
  });

  socket.on("block:release", async ({ blockId }) => {
    try {
      if (!socket.user?.id) {
        socket.emit("block:failed", { blockId, reason: "not_authenticated" });
        return;
      }

      const updated = await blockService.releaseBlock({
        blockId,
        userId: socket.user.id,
      });

      io.emit("block:update", {
        ...updated,
        releasedById: socket.user.id,
        releasedByName: socket.user.username,
      });
    } catch (err) {
      const reason = err.reason || "unknown_error";
      const message = err.message || "Failed to release block";
      console.error(`[block:release] ${reason}:`, message);
      socket.emit("block:failed", { blockId, reason });
    }
  });

  socket.on("disconnect", () => {
    console.log("[disconnect] User disconnected:", socket.id);
  });
};
