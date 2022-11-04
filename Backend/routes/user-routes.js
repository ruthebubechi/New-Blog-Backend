import express from "express";
import { getAllUser, login, signup } from "../controllers/user-controller.js";

const router = express.Router();

//router to get users
router.get("/", getAllUser);
//router for a user to signup before creating any post
router.post("/signup", signup);
router.post("/login", login);

export default router;
