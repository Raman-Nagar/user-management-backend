import express from "express";

import {
  addUser,
  deleteUser,
  getAllUsers,
  getProfile,
  getUserStats,
  updateProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.post("/add", authMiddleware, addUser);
router.put("/:id", authMiddleware, upload.single("avatar"), updateProfile);
router.get("/all", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/stats", authMiddleware, getUserStats);

export default router;
