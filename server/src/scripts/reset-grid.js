import mongoose from "mongoose";
import "dotenv/config";
import { Block } from "../models/block.model.js";
import { ensureGridSeeded } from "../services/block.service.js";

const resetGrid = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await ensureGridSeeded();

  const result = await Block.updateMany(
    {},
    {
      $set: {
        ownerId: null,
        color: null,
        claimedAt: null,
      },
    }
  );

  console.log(`Grid reset. Matched ${result.matchedCount} blocks and updated ${result.modifiedCount} blocks.`);
  await mongoose.disconnect();
};

resetGrid().catch((error) => {
  console.error("Grid reset failed:", error.message);
  process.exit(1);
});
