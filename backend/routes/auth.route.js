import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  checkAuth,
  changePassword,
  forgetPassword,
  resetPassword,
  addFriend,
  getFriends,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);

router.post("/update-profile", protectRoute, updateProfile);
router.post("/add-friend", protectRoute, addFriend);
router.get("/friends", protectRoute, getFriends);

router.get("/check-auth", protectRoute, checkAuth);

router.post("/change-password", protectRoute, changePassword);
router.post("/reset-password/:token", resetPassword);

export default router;
