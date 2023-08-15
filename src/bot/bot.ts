import { Telegraf, Context } from "telegraf";
import { prisma } from "../prisma";
import { authenticateAdmin, registerAdmin } from "../admin/admin.service";
import { getAllExercises } from "../exercise/exercise.service";
import { Exercise, ExerciseLevel } from "@prisma/client";

const bot = new Telegraf(process.env.TELEGRAM!);

bot.command("start", async (ctx) => {
	await ctx.reply(
		"Добро пожаловать! Вы можете использовать команды /register и /login для администрирования или другие команды для работы с упражнениями."
	);
});

const isAdmin = async (ctx: Context): Promise<boolean> => {
	const telegramId = ctx.from!.id;
	const admin = await prisma.user.findUnique({ where: { telegramId } });
	return !!admin && admin.isAdmin;
};

bot.command("register", async (ctx) => {
	const telegramId = ctx.from!.id;
	const password = ctx.message!.text!;

	try {
		const token = await registerAdmin(telegramId, password);
		await ctx.reply(`Вы успешно зарегистрированы! Токен: ${token}`);
	} catch (err: any) {
		await ctx.reply(`Ошибка: ${err.message}`);
	}
});

bot.command("login", async (ctx) => {
	const telegramId = ctx.from!.id;
	const password = ctx.message!.text!;

	try {
		const token = await authenticateAdmin(telegramId, password);
		await ctx.reply(`Вы успешно вошли! Токен: ${token}`);
	} catch (err: any) {
		await ctx.reply(`Ошибка: ${err.message}`);
	}
});

bot.command("admin", async (ctx) => {
	if (await isAdmin(ctx)) {
		await ctx.reply("Выберите действие:", {
			reply_markup: {
				keyboard: [
					["Все упражнения"],
					["Создать упражнение"],
					["Изменить упражнение"],
					["Удалить упражнение"],
				],
				one_time_keyboard: true,
			},
		});
	} else {
		await ctx.reply("Вы не являетесь админом!");
	}
});

bot.hears("Все упражнения", async (ctx) => {
	if (await isAdmin(ctx)) {
		const exercises = await getAllExercises();
		let message = "";

		Object.entries(exercises).forEach(([level, exercisesArray]) => {
			message += `Уровень ${level}:\n`;
			exercisesArray.forEach((ex) => {
				message += `- ${ex.task}\n`;
			});
			message += "\n";
		});

		await ctx.reply(message || "Упражнений пока нет.");
	}
});

let creatingExercise: Partial<Exercise> = {};

bot.hears("Создать упражнение", async (ctx) => {
	if (await isAdmin(ctx)) {
		await ctx.reply("Выберите уровень сложности:", {
			reply_markup: {
				keyboard: [["Легко"], ["Средне"], ["Сложно"]],
				one_time_keyboard: true,
			},
		});
	}
});

const levelMapping: Record<string, ExerciseLevel> = {
	Легко: ExerciseLevel.EASY,
	Средне: ExerciseLevel.MEDIUM,
	Сложно: ExerciseLevel.HARD,
};

bot.hears(["Легко", "Средне", "Сложно"], async (ctx) => {
	if (await isAdmin(ctx)) {
		const level = ctx.message!.text;
		creatingExercise.level = levelMapping[level];
		await ctx.reply("Введите упражнение:");
	}
});

bot.on("text", async (ctx) => {
	if (
		(await isAdmin(ctx)) &&
		creatingExercise.level &&
		!creatingExercise.task
	) {
		creatingExercise.task = ctx.message!.text;
		await ctx.reply("Упражнение сохранено!");
	}
});

bot.launch();
