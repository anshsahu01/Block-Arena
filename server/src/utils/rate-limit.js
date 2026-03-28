import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

let redis;
let limiter;
const isProduction = process.env.NODE_ENV === "production";

const initializeRateLimiter = () => {
  if (!process.env.REDIS_URL) {
    if (isProduction) {
      throw new Error("REDIS_URL is required in production");
    }

    console.warn("[Rate Limiter] REDIS_URL not set. Rate limiting disabled for local development.");
    return null;
  }

  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 10000,
      retryStrategy: () => null,
    });

    let errorLogged = false;
    redis.on("error", (err) => {
      if (!errorLogged) {
        console.error("[Redis] Connection error:", err.message || "Unable to connect");
        errorLogged = true;
      }
    });

    redis.on("connect", () => {
      console.log("[Redis] Connected to rate limiter");
    });

    limiter = new RateLimiterRedis({
      storeClient: redis,
      points: 5,
      duration: 1,
      blockDurationMs: 0,
      inMemoryBlockOnConsumed: 5,
      inMemoryBlockDurationMs: 1000,
      keyPrefix: "block:claim:",
    });

    return limiter;
  } catch (error) {
    console.error("[Rate Limiter] Initialization failed:", error.message);
    return null;
  }
};

const rateLimiter = initializeRateLimiter();

export const assertRateLimiterReady = async () => {
  if (!process.env.REDIS_URL) {
    return;
  }

  try {
    await redis.ping();
  } catch (error) {
    if (isProduction) {
      throw new Error(`Redis is required in production but is unavailable: ${error.message}`);
    }

    console.warn("[Rate Limiter] Redis unavailable, continuing without rate limiting:", error.message);
  }
};

export const checkClaimRateLimit = async (userId) => {
  if (!rateLimiter) {
    return true;
  }

  try {
    await rateLimiter.consume(userId);
    return true;
  } catch (error) {
    if (error.isFirstInDuration) {
      console.log(`[Rate Limiter] Limit reset for user ${userId}`);
      return true;
    }

    if (error.remainingPoints !== undefined) {
      console.log(`[Rate Limiter] Blocked user ${userId}, ${error.remainingPoints} points remaining`);
      return false;
    }

    console.warn("[Rate Limiter] Error checking limit, allowing request:", error.message);
    return true;
  }
};

export const getRedisConnection = () => redis;

export const closeRedisConnection = async () => {
  if (redis) {
    try {
      await redis.quit();
      console.log("[Redis] Connection closed");
    } catch {
      redis.disconnect();
    }
  }
};
