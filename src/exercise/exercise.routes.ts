import { isAdmin, protect } from "./../admin/middleware/admin.middleware";
import express from "express";
import * as exerciseController from "./exercise.controller";

const router = express.Router();

router
	.route("/")
	.get(protect, isAdmin, exerciseController.getExercises)
	.post(protect, isAdmin, exerciseController.addExercise);

router
	.route("/:id")
	.put(protect, isAdmin, exerciseController.modifyExercise)
	.delete(protect, isAdmin, exerciseController.removeExercise);

export default router;
