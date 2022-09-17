/*
  Warnings:

  - The primary key for the `Bet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BetLeg` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Contest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ContestEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Offer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bgImageUrl` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `league` on the `Offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "League" AS ENUM ('NFL', 'NBA', 'NCAAB', 'MLB', 'NHL', 'NCAAF', 'WNBA', 'TENNIS', 'MMA', 'WBC');

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_contestEntriesId_fkey";

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_userId_fkey";

-- DropForeignKey
ALTER TABLE "BetLeg" DROP CONSTRAINT "BetLeg_offersId_fkey";

-- DropForeignKey
ALTER TABLE "ContestEntry" DROP CONSTRAINT "ContestEntry_contestsId_fkey";

-- DropForeignKey
ALTER TABLE "ContestEntry" DROP CONSTRAINT "ContestEntry_userId_fkey";

-- AlterTable
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contestEntriesId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bet_id_seq";

-- AlterTable
ALTER TABLE "BetLeg" DROP CONSTRAINT "BetLeg_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "offersId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BetLeg_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BetLeg_id_seq";

-- AlterTable
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_pkey",
ADD COLUMN     "bgImageUrl" VARCHAR(255) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Contest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Contest_id_seq";

-- AlterTable
ALTER TABLE "ContestEntry" DROP CONSTRAINT "ContestEntry_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "contestsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContestEntry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ContestEntry_id_seq";

-- AlterTable
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "league",
ADD COLUMN     "league" "League" NOT NULL,
ADD CONSTRAINT "Offer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Offer_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "ContestEntry" ADD CONSTRAINT "ContestEntry_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestEntry" ADD CONSTRAINT "ContestEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetLeg" ADD CONSTRAINT "BetLeg_offersId_fkey" FOREIGN KEY ("offersId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestEntriesId_fkey" FOREIGN KEY ("contestEntriesId") REFERENCES "ContestEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
