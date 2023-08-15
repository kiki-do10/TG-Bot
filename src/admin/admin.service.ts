import { prisma } from "../prisma";
import { hash, verify } from "argon2";
import { generateToken } from "./generateToken";

export const authenticateAdmin = async (
	telegramId: number,
	password: string
) => {
	const admin = await prisma.user.findUnique({
		where: { telegramId },
	});

	if (!admin || !admin.isAdmin) {
		throw new Error("Администратор не найден");
	}

	if (!admin.password) {
		throw new Error("У администратора нет пароля");
	}

	const isPasswordValid = await verify(admin.password, password);

	if (!isPasswordValid) {
		throw new Error("Неправильный пароль");
	}

	return generateToken(admin.id);
};

export const registerAdmin = async (telegramId: number, password: string) => {
	const existingUser = await prisma.user.findUnique({
		where: { telegramId },
	});

	if (existingUser) {
		throw new Error("Такой пользователь уже существует");
	}

	const hashedPassword = await hash(password);

	const newAdmin = await prisma.user.create({
		data: {
			telegramId,
			isAdmin: true,
			password: hashedPassword,
		},
	});

	return generateToken(newAdmin.id);
};
