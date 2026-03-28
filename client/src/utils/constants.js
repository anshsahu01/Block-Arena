export const GRID_SIZE = 20;
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const DEFAULT_AUTH_FORM = {
  username: "",
  email: "",
  password: "",
};

export const AUTH_MODES = {
  LOGIN: "login",
  REGISTER: "register",
};

export const ERROR_MESSAGES = {
  ALREADY_CLAIMED: "That block was already captured by someone else.",
  COLOR_REQUIRED: "Choose a color before capturing blocks.",
  RATE_LIMITED: "Clicking too fast. Please slow down.",
  NOT_AUTHENTICATED: "Session expired. Please login again.",
  NOT_OWNER: "You can only release blocks you own.",
  GENERIC_BLOCK_ERROR: "Failed to capture block. Please try again.",
  CONNECTION_LOST: "Socket connection lost. Reconnecting...",
};

export const BLOCK_SIZE = 28; // in pixels
export const BLOCK_GAP = 4; // in pixels
