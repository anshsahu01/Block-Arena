import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

const extractTokenFromSocket = (socket) => {
  const handshakeToken = socket.handshake?.auth?.token;
  if (handshakeToken) {
    return handshakeToken;
  }

  const headerValue = socket.handshake?.headers?.authorization;
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

export const authenticateSocket = async (socket, next) => {
  try {
    const token = extractTokenFromSocket(socket);

    if (!token) {
      return next(new Error("Unauthorized: missing token"));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    socket.user = {
      id: user._id.toString(),
      username: user.username,
      color: user.color,
    };

    return next();
  } catch {
    return next(new Error("Unauthorized: invalid token"));
  }
};
