/**
 * Generate a random hex color
 */
export const randomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

/**
 * Build a map of blocks by their ID for faster lookup
 */
export const buildGridMap = (blocks) => {
  const map = {};
  blocks.forEach((block) => {
    map[block._id] = block;
  });
  return map;
};

/**
 * Calculate captured block count for a user
 */
export const calculateCapturedCount = (grid, userId) => {
  if (!userId) return 0;
  return Object.values(grid).filter((block) => block.ownerId === userId).length;
};
