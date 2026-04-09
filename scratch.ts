import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const existing = await prisma.user.findMany();
    console.log(existing);
  } catch (e) {
    console.error("ERROR:", e);
  }
}

test();
