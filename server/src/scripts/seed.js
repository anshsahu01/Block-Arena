import mongoose from "mongoose";
import "dotenv/config";
import { Block } from "../models/block.model.js";

const GRID_SIZE = 20;

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingCount = await Block.countDocuments();
  if (existingCount > 0) {
    console.log(`Grid already seeded with ${existingCount} blocks. Skipping seed.`);
    process.exit(0);
  }

  const blocks = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      blocks.push({ _id: `${i}-${j}` });
    }
  }

  await Block.insertMany(blocks);
  console.log(`Grid seeded with ${blocks.length} blocks`);

  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
