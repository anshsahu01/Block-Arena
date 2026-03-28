import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return process.env.JWT_SECRET;
};

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      color: user.color,
    },
    getJwtSecret(),
    {
      expiresIn: "1d",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
