import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.patch("/me/preferences", requireAuth, async (req, res) => {
  try {
    const result = await userController.updatePreferences(req.user._id, req.body);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to update preferences";
    return res.status(statusCode).json({ message });
  }
});

export default router;
