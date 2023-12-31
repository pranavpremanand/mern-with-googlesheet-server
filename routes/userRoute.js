import express from "express";
import {
  changeUserStatus,
  doLogin,
  doSignup,
  getUserData,
  getUsersList,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();

// signup
router.post("/signup", doSignup);

// login
router.post("/login", doLogin);

// get user
router.get("/get-user", authMiddleware, getUserData);

// get users except admin
router.get("/users", getUsersList);

// block or unblock user
router.post("/change-user-status", changeUserStatus);

export default router;
