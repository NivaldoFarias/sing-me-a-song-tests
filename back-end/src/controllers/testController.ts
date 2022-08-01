import { Request, Response } from 'express';
import { prisma } from '../database.js';

async function resetDatabase(_req: Request, res: Response) {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY CASCADE;`;

  res.sendStatus(200);
}

async function deleteOne(_req: Request, res: Response) {
  const recommendations = await prisma.recommendation.findMany({});
  const id = recommendations[recommendations.length - 1].id;

  await prisma.recommendation.delete({
    where: {
      id: Number(id),
    },
  });
  res.sendStatus(200);
}

export { resetDatabase, deleteOne };
