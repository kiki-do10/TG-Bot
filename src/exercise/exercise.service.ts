import { prisma } from "../prisma";
import { ExerciseLevel } from "../utils/types/type";

export const getAllExercises = async () => {
	const exercises = await prisma.exercise.findMany();

	const groupedExercises = exercises.reduce(
		(acc, exercise) => {
			if (!acc[exercise.level]) {
				acc[exercise.level] = [];
			}
			acc[exercise.level].push(exercise);
			return acc;
		},
		{} as Record<ExerciseLevel, (typeof exercises)[0][]>
	);

	return groupedExercises;
};

export const createExercise = async (
	level: ExerciseLevel,
	requiresProof: boolean,
	task: string
) => {
	return await prisma.exercise.create({
		data: { level, requiresProof, task },
	});
};

export const updateExercise = async (
	id: number,
	level: ExerciseLevel,
	requiresProof: boolean
) => {
	return await prisma.exercise.update({
		where: { id },
		data: { level, requiresProof },
	});
};

export const deleteExercise = async (id: number) => {
	await prisma.exercise.delete({
		where: { id },
	});
};
