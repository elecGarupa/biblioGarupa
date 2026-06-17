import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'hugo', password: 'Hugo@123', nombre: 'Hugo', nombreCompleto: 'Hugo Goncalvez' },
    { username: 'gustavo', password: 'Gus159', nombre: 'Gustavo', nombreCompleto: 'Gustavo Alvarenga' },
    { username: 'veronica', password: 'Ver456', nombre: 'Verónica', nombreCompleto: 'Veronica Otazu' },
    { username: 'olga', password: 'Olg789', nombre: 'Olga', nombreCompleto: 'Olga Acosta' },
    { username: 'tamara', password: 'Tam159', nombre: 'Tamara', nombreCompleto: 'Tamara Viera' },
    { username: 'lissi', password: 'Lis321', nombre: 'Lissi', nombreCompleto: 'Lissi Lopez' },
    { username: 'ester', password: 'Est654', nombre: 'Ester', nombreCompleto: 'Ester Troche' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.usuario.upsert({
      where: { username: u.username },
      update: { password: passwordHash },
      create: { username: u.username, password: passwordHash, nombre: u.nombre, nombreCompleto: u.nombreCompleto, rol: 'ADMIN' },
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
