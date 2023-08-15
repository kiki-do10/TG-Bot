import express from "express";
import {
	authAdminController,
	registerAdminController,
} from "./admin.controller";

const router = express.Router();

router.route("/login").post(authAdminController);
router.route("/register").post(registerAdminController);

export default router;
