import { Request, Response } from 'express';
import { prisma } from '../database.js';

async function resetDatabase(req: Request, res: Response) {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY CASCADE;`;

  res.sendStatus(200);
}
export { resetDatabase };
