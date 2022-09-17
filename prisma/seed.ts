/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

/**
 * 1. Create a joinable matchplay contest
 * 2. Create a joinable fantasy contest
 * 3. A contest already in play.
 */
async function main() {
  await prisma.contest.upsert({
    create: {
      id: '87d72f7b-a205-4379-a208-7d3c3e5e6328',
      name: 'Match Play Contest',
      description: 'This is a match play contest',
      isActive: true,
      startDate: dayjs().add(1, 'h').toDate(),
      endDate: dayjs().add(1, 'day').toDate(),
      type: 'match',
      bgImageUrl: 'https://picsum.photos/200',
      created_at: new Date(),
      updated_at: new Date(),
    },
    update: {},
    where: {
      id: '87d72f7b-a205-4379-a208-7d3c3e5e6328',
    },
  });
  await prisma.contest.upsert({
    create: {
      id: '20500af0-9e18-47d7-80b0-fe51125497ae',
      name: 'Match Play Contest',
      description: 'This is a match play contest',
      isActive: true,
      startDate: dayjs().add(1, 'h').toDate(),
      endDate: dayjs().add(1, 'day').toDate(),
      type: 'picks',
      bgImageUrl: 'https://picsum.photos/200',
      created_at: new Date(),
      updated_at: new Date(),
    },
    update: {},
    where: {
      id: '20500af0-9e18-47d7-80b0-fe51125497ae',
    },
  });
  await prisma.contest.upsert({
    create: {
      id: '2d500af0-9e18-47d7-80b0-fe51125497ae',
      name: 'Match Play Contest',
      description: 'This is a match play contest',
      isActive: true,
      startDate: dayjs().subtract(1, 'h').toDate(),
      endDate: dayjs().add(1, 'day').toDate(),
      type: 'picks',
      bgImageUrl: 'https://picsum.photos/200',
      created_at: new Date(),
      updated_at: new Date(),
    },
    update: {},
    where: {
      id: '2d500af0-9e18-47d7-80b0-fe51125497ae',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
