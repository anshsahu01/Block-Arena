import { Block } from "../models/block.model.js";

const GRID_SIZE = 20;

export const ensureGridSeeded = async () => {
  const existingCount = await Block.countDocuments();

  if (existingCount > 0) {
    return;
  }

  const blocks = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      blocks.push({ _id: `${row}-${col}` });
    }
  }

  await Block.insertMany(blocks, { ordered: false });
};

export const claimBlock = async ({ blockId, userId, userColor }) => {
  await ensureGridSeeded();

  if (typeof blockId !== "string" || !/^\d+-\d+$/.test(blockId)) {
    throw {
      statusCode: 400,
      reason: "invalid_block_id",
      message: "Invalid block format",
    };
  }

  if (!userId || typeof userId !== "string") {
    throw {
      statusCode: 400,
      reason: "invalid_user",
      message: "Authentication required",
    };
  }

  if (!userColor || typeof userColor !== "string") {
    throw {
      statusCode: 400,
      reason: "color_required",
      message: "User color not set",
    };
  }

  const updated = await Block.findOneAndUpdate(
    { _id: blockId, ownerId: null },
    {
      ownerId: userId,
      color: userColor,
      claimedAt: new Date(),
    },
    { returnDocument: "after" }
  ).lean();

  if (!updated) {
    const existingBlock = await Block.exists({ _id: blockId });

    if (!existingBlock) {
      throw {
        statusCode: 404,
        reason: "block_not_found",
        message: "Block does not exist",
      };
    }

    throw {
      statusCode: 409,
      reason: "already_claimed",
      message: "Block already claimed",
    };
  }

  return updated;
};

export const releaseBlock = async ({ blockId, userId }) => {
  await ensureGridSeeded();

  if (typeof blockId !== "string" || !/^\d+-\d+$/.test(blockId)) {
    throw {
      statusCode: 400,
      reason: "invalid_block_id",
      message: "Invalid block format",
    };
  }

  if (!userId || typeof userId !== "string") {
    throw {
      statusCode: 400,
      reason: "invalid_user",
      message: "Authentication required",
    };
  }

  const existingBlock = await Block.findById(blockId).lean();

  if (!existingBlock) {
    throw {
      statusCode: 404,
      reason: "block_not_found",
      message: "Block does not exist",
    };
  }

  if (!existingBlock.ownerId) {
    return existingBlock;
  }

  if (existingBlock.ownerId !== userId) {
    throw {
      statusCode: 403,
      reason: "not_owner",
      message: "Only the owner can release this block",
    };
  }

  return await Block.findOneAndUpdate(
    { _id: blockId, ownerId: userId },
    {
      ownerId: null,
      color: null,
      claimedAt: null,
    },
    { returnDocument: "after" }
  ).lean();
};

export const getGridBlocks = async () => {
  await ensureGridSeeded();
  return await Block.find({}).lean();
};

export const getBlocksByOwner = async (ownerId) => {
  return await Block.find({ ownerId }).countDocuments();
};

export const getLeaderboard = async (limit = 10) => {
  return await Block.aggregate([
    { $match: { ownerId: { $ne: null } } },
    { $group: { _id: "$ownerId", captured: { $sum: 1 } } },
    { $sort: { captured: -1 } },
    { $limit: limit },
  ]);
};
