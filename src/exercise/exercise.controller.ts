import asyncHandler from "express-async-handler";
import * as exerciseService from "./exercise.service";
import { Request, Response } from "express";

export const getExercises = asyncHandler(
	async (req: Request, res: Response) => {
		const exercises = await exerciseService.getAllExercises();

		res.json(exercises);
	}
);

export const addExercise = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { level, requiresProof, task } = req.body;
		const exercise = await exerciseService.createExercise(
			level,
			requiresProof,
			task
		);
		res.json(exercise);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

export const modifyExercise = asyncHandler(
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const { level, requiresProof } = req.body;

		const exercise = await exerciseService.updateExercise(
			id,
			level,
			requiresProof
		);

		res.json(exercise);
	}
);

export const removeExercise = asyncHandler(
	async (req: Request, res: Response) => {
		const id = +req.params.id;

		const exercise = await exerciseService.deleteExercise(id);

		res.json(exercise);
	}
);
