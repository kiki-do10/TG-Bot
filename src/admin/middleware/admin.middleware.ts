import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "../../prisma";

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}

interface DecodedToken {
	id: number;
}

export const isAdmin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user && req.user.isAdmin) {
			next();
		} else {
			res.status(403).json({ message: "Доступ запрещён." });
		}
	}
);

export const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;

		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];

			console.log(token);

			try {
				const decoded = jwt.verify(
					token,
					process.env.JWT_SECRET!
				) as DecodedToken;

				const userFound = await prisma.user.findUnique({
					where: { id: decoded.id },
				});

				if (userFound) {
					req.user = userFound;
					next();
				} else {
					res.status(401).json({ message: "Не авторизован!" });
				}
			} catch (error: any) {
				res.status(401).json({ message: "Некорректный токен." });
			}
		} else {
			res
				.status(401)
				.json({ message: "Заголовок авторизации не предоставляется." });
		}
	}
);
