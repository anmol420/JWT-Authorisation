import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    dashboard,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/dashboard").get(dashboard);

export default router;