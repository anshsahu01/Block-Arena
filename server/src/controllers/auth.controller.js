import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validators.js";
import { sanitizeUser } from "../utils/serializers.js";
import { signAccessToken } from "../utils/jwt.js";

export const register = async ({ username, email, password }) => {
  if (!isValidUsername(username)) {
    throw {
      statusCode: 400,
      message: "Username must be 3-24 chars and contain only letters, numbers, or _",
    };
  }

  if (!isValidEmail(email)) {
    throw { statusCode: 400, message: "A valid email is required" };
  }

  if (!isValidPassword(password)) {
    throw { statusCode: 400, message: "Password must be at least 8 characters" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username }],
  }).lean();

  if (existing) {
    throw { statusCode: 409, message: "Email or username already in use" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email: normalizedEmail,
    passwordHash,
  });

  const token = signAccessToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const login = async ({ email, password }) => {
  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw { statusCode: 400, message: "Invalid email or password format" };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const token = signAccessToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getProfile = (user) => {
  return {
    user: sanitizeUser(user),
  };
};
