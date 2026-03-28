import { useEffect, useMemo, useRef, useState } from "react";
import {
  connectSocket,
  disconnectSocket,
  emitGridInit,
  setupGridSocketListeners,
  cleanupGridSocketListeners,
  emitBlockClaim,
  emitBlockRelease,
  socket,
} from "../services/socket.js";
import { buildGridMap, calculateCapturedCount } from "../utils/helpers.js";
import { ERROR_MESSAGES } from "../utils/constants.js";

export const useGrid = (token, user, isLoggedIn) => {
  const [grid, setGrid] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [liveFeed, setLiveFeed] = useState([]);
  const usernameByIdRef = useRef({});

  const capturedCount = useMemo(() => {
    return calculateCapturedCount(grid, user?.id);
  }, [grid, user?.id]);

  function handleBlockError(reason) {
    const messageMap = {
      already_claimed: ERROR_MESSAGES.ALREADY_CLAIMED,
      color_required: ERROR_MESSAGES.COLOR_REQUIRED,
      rate_limited: ERROR_MESSAGES.RATE_LIMITED,
      not_authenticated: ERROR_MESSAGES.NOT_AUTHENTICATED,
      not_owner: ERROR_MESSAGES.NOT_OWNER,
    };

    setStatusMessage(messageMap[reason] || ERROR_MESSAGES.GENERIC_BLOCK_ERROR);
  }

  // Setup socket listeners and connect when logged in
  useEffect(() => {
    if (!isLoggedIn || !user?.color) {
      return undefined;
    }

    connectSocket(token);
    emitGridInit();

    setupGridSocketListeners({
      onGridData: (blocks) => {
        setGrid(buildGridMap(blocks));
        setLiveFeed([]);
      },
      onBlockUpdate: (block) => {
        let previousOwnerId;
        setGrid((prev) => {
          previousOwnerId = prev[block._id]?.ownerId;
          return { ...prev, [block._id]: block };
        });

        if (block.ownerId && block.ownerName) {
          usernameByIdRef.current[block.ownerId] = block.ownerName;
        }

        setLiveFeed((prev) => {
          const isRelease = !block.ownerId;
          const actorId = isRelease
            ? block.releasedById || previousOwnerId || null
            : block.ownerId || null;

          const actor = isRelease
            ? block.releasedByName || (actorId ? usernameByIdRef.current[actorId] : null) || (actorId === user?.id ? user?.username : null) || actorId || "Unknown"
            : block.ownerName || (actorId ? usernameByIdRef.current[actorId] : null) || (actorId === user?.id ? user?.username : null) || actorId || "Unknown";

          if (!actor) {
            return prev;
          }

          const nextItem = {
            id: `${block._id}-${Date.now()}`,
            action: isRelease ? "release" : "claim",
            actor,
            actorId,
            color: block.color,
            blockId: block._id,
          };

          return [nextItem, ...prev].slice(0, 20);
        });
      },
      onBlockFailed: ({ reason }) => {
        handleBlockError(reason);
      },
    });

    return () => {
      cleanupGridSocketListeners();
      disconnectSocket();
    };
  }, [isLoggedIn, token, user?.color, user?.id, user?.username]);

  const claimBlock = (blockId, block) => {
    if (!socket.connected) {
      setStatusMessage(ERROR_MESSAGES.CONNECTION_LOST);
      return;
    }

    if (block?.ownerId) {
      emitBlockRelease(blockId);
      setStatusMessage("");
      return;
    }

    emitBlockClaim(blockId);
    setStatusMessage("");
  };

  const clearMessage = () => setStatusMessage("");

  return {
    grid,
    capturedCount,
    statusMessage,
    liveFeed,
    claimBlock,
    clearMessage,
  };
};
