import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      default: null,
      index: true,
    },
    color: {
      type: String,
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const Block = mongoose.model("Block", blockSchema);
