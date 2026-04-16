import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed placeholder');
}

main().finally(async () => {
  await prisma.$disconnect();
});
