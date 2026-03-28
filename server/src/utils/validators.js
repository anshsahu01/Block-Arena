export const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password = "") => {
  return typeof password === "string" && password.length >= 8;
};

export const isValidUsername = (username = "") => {
  return /^[a-zA-Z0-9_]{3,24}$/.test(username);
};

export const isValidHexColor = (value = "") => {
  return /^#([0-9A-Fa-f]{6})$/.test(value);
};
