/*
  Warnings:

  - You are about to drop the `account_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account_data__followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account_data__following` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contests_contestants__users_contests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `games_components` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sports_page_feed_limits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strapi_administrator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strapi_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strapi_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strapi_users_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strapi_webhooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `upload_file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `upload_file_morph` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users-permissions_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users-permissions_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users-permissions_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WIN', 'LOSS', 'PUSH');

-- CreateEnum
CREATE TYPE "BetType" AS ENUM ('TEASER', 'STRAIGHT', 'PARLAY');

-- CreateEnum
CREATE TYPE "BetLegType" AS ENUM ('OVER_ODDS', 'UNDER_ODDS', 'SPREAD_AWAY_ODDS', 'SPREAD_HOME_ODDS', 'MONEYLINE_AWAY_ODDS', 'MONEYLINE_HOME_ODDS');

-- DropForeignKey
ALTER TABLE "contests_contestants__users_contests" DROP CONSTRAINT "contests_contestants__users_contests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "games_components" DROP CONSTRAINT "game_id_fk";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_contest_fkey";

-- DropTable
DROP TABLE "account_data";

-- DropTable
DROP TABLE "account_data__followers";

-- DropTable
DROP TABLE "account_data__following";

-- DropTable
DROP TABLE "bets";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "contests";

-- DropTable
DROP TABLE "contests_contestants__users_contests";

-- DropTable
DROP TABLE "core_store";

-- DropTable
DROP TABLE "games";

-- DropTable
DROP TABLE "games_components";

-- DropTable
DROP TABLE "offers";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "sports_page_feed_limits";

-- DropTable
DROP TABLE "strapi_administrator";

-- DropTable
DROP TABLE "strapi_permission";

-- DropTable
DROP TABLE "strapi_role";

-- DropTable
DROP TABLE "strapi_users_roles";

-- DropTable
DROP TABLE "strapi_webhooks";

-- DropTable
DROP TABLE "upload_file";

-- DropTable
DROP TABLE "upload_file_morph";

-- DropTable
DROP TABLE "users-permissions_permission";

-- DropTable
DROP TABLE "users-permissions_role";

-- DropTable
DROP TABLE "users-permissions_user";

-- DropTable
DROP TABLE "wallets";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestEntry" (
    "id" SERIAL NOT NULL,
    "tokens" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,
    "contestsId" INTEGER NOT NULL,

    CONSTRAINT "ContestEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetLeg" (
    "id" SERIAL NOT NULL,
    "type" "BetLegType" NOT NULL,
    "odds" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "spreadHomeLine" INTEGER NOT NULL,
    "spreadAwayLine" INTEGER NOT NULL,
    "offersId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetLeg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "stake" DECIMAL(10,2) NOT NULL,
    "status" "BetStatus" NOT NULL,
    "payout" DECIMAL(10,2) NOT NULL,
    "type" "BetType" NOT NULL,
    "legs" JSONB NOT NULL DEFAULT '"[]"',
    "odds" INTEGER NOT NULL,
    "contestEntriesId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "league" VARCHAR(255) NOT NULL,
    "season" INTEGER NOT NULL,
    "seasonType" VARCHAR(255) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "overOdds" DECIMAL(10,2) NOT NULL,
    "underOdds" DECIMAL(10,2) NOT NULL,
    "spreadAway" DECIMAL(10,2) NOT NULL,
    "spreadHome" DECIMAL(10,2) NOT NULL,
    "spreadAwayOdds" DECIMAL(10,2) NOT NULL,
    "spreadHomeOdds" DECIMAL(10,2) NOT NULL,
    "moneylineAwayOdds" DECIMAL(10,2) NOT NULL,
    "moneylineHomeOdds" DECIMAL(10,2) NOT NULL,
    "gameId" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "arenaName" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "awayTeam" VARCHAR(255) NOT NULL,
    "homeTeam" VARCHAR(255) NOT NULL,
    "gameTime" TIMESTAMPTZ(6) NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "currentPeriod" INTEGER NOT NULL,
    "periodTimeRemaining" VARCHAR(255) NOT NULL,
    "awayPeriods" JSONB NOT NULL,
    "homePeriods" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

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
