import { prisma } from "./client";

async function main() {
  console.log("Connecting...");

  await prisma.$connect();

  const result = await prisma.$queryRaw`SELECT version()`;

  console.log(result);

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
});
