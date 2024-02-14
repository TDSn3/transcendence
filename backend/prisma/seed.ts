// Test data to seed the database with

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    // create two dummy users
    const user1 = await prisma.user.upsert({
      where: { email42: 'bob@42.com' },
      update: {},
      create: {
        id : '3',
        createdAt: new Date(),
        updatedAt: new Date(),
        isTwoFactorAuthEnabled: false,
        intraId: 423,
        email42: 'bob@gamil.fr',
        login: "bobbye",
        firstName: 'Bob',
        lastName: 'Dylan',
        avatar: 'https://cdn.intra.42.fr/users/bobby.jpg',
      },
    });
  
    const user2 = await prisma.user.upsert({
        where: { email42: 'joe@42.com' },
        update: {},
        create: {
          id : '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          isTwoFactorAuthEnabled: false,
          intraId: 413,
          email42: 'joe@42.fr',
          login: 'joe',
          firstName: 'Joe',
          lastName: 'feq',
          avatar: 'https://cdn.intra.42.fr/users/joeby.jpg',
        },
      });
    
    console.log({ user1, user2 });
}

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {

await prisma.$disconnect();
});