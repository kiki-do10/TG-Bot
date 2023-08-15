import asyncHandler from "express-async-handler";
import { authenticateAdmin, registerAdmin } from "./admin.service";
import { Request, Response } from "express";

export const authAdminController = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { telegramId, password } = req.body;
			const token = await authenticateAdmin(telegramId, password);
			res.json({ token });
		} catch (error: any) {
			res.status(401).json({ message: error.message });
		}
	}
);

export const registerAdminController = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { telegramId, password } = req.body;
			const token = await registerAdmin(telegramId, password);
			res.json({ token });
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	}
);
