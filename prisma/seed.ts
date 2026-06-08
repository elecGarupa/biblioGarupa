import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Hugo@123', 10);
  
  const user = await prisma.usuario.upsert({
    where: { username: 'hugo' },
    update: {
      password: passwordHash,
    },
    create: {
      username: 'hugo',
      password: passwordHash,
      nombre: 'Hugo',
      rol: 'ADMIN',
    },
  });

  console.log('Usuario creado/actualizado:', user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
