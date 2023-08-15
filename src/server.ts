import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./admin/admin.routes";
import exerciseRoutes from "./exercise/exercise.routes";

import { prisma } from "./prisma";

dotenv.config();
const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exercise", exerciseRoutes);

async function main() {
	app.listen(PORT, () =>
		console.log(
			`Server is running on status: ${process.env.STATUS} in PORT:${PORT}`
		)
	);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
