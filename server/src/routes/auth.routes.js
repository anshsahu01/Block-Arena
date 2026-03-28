import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const result = await authController.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to register";
    return res.status(statusCode).json({ message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await authController.login(req.body);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to login";
    return res.status(statusCode).json({ message });
  }
});

router.get("/me", requireAuth, (req, res) => {
  const result = authController.getProfile(req.user);
  return res.json(result);
});

export default router;
