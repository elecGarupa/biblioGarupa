import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'hugo', password: 'Hugo@123', nombre: 'Hugo' },
    { username: 'gustavo', password: 'Gus159', nombre: 'Gustavo' },
    { username: 'veronica', password: 'Ver456', nombre: 'Verónica' },
    { username: 'olga', password: 'Olg789', nombre: 'Olga' },
    { username: 'tamara', password: 'Tam159', nombre: 'Tamara' },
    { username: 'lissi', password: 'Lis321', nombre: 'Lissi' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.usuario.upsert({
      where: { username: u.username },
      update: { password: passwordHash },
      create: { username: u.username, password: passwordHash, nombre: u.nombre, rol: 'ADMIN' },
    });
    console.log('Usuario creado/actualizado:', user.username);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
