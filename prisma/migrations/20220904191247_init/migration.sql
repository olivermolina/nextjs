-- CreateEnum
CREATE TYPE "ContestType" AS ENUM ('MATCH', 'FANTASY');

-- CreateTable
CREATE TABLE "account_data" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(10,2),
    "user" INTEGER,
    "published_at" TIMESTAMPTZ(6),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN,
    "description" TEXT,

    CONSTRAINT "account_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_data__followers" (
    "id" SERIAL NOT NULL,
    "account_datum_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "account_data__followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_data__following" (
    "id" SERIAL NOT NULL,
    "account_datum_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "account_data__following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets" (
    "id" SERIAL NOT NULL,
    "game" INTEGER,
    "stake" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "user" INTEGER,
    "payout" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(255),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "post" INTEGER,
    "challengerId" INTEGER,
    "challengeAccepted" BOOLEAN,
    "challenger" INTEGER,
    "challengeState" VARCHAR(255),
    "challengerUsername" VARCHAR(255),
    "contest" INTEGER,
    "legs" JSONB DEFAULT '"[]"',
    "odds" INTEGER,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests_contestants__users_contests" (
    "id" SERIAL NOT NULL,
    "contest_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "contests_contestants__users_contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_store" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255),
    "value" TEXT,
    "type" VARCHAR(255),
    "environment" VARCHAR(255),
    "tag" VARCHAR(255),

    CONSTRAINT "core_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "gameId" VARCHAR(255),
    "status" VARCHAR(255),
    "lastUpdated" TIMESTAMPTZ(6),
    "raw" JSONB,
    "league" VARCHAR(255),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games_components" (
    "id" SERIAL NOT NULL,
    "field" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "component_type" VARCHAR(255) NOT NULL,
    "component_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "games_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "league" VARCHAR(255) NOT NULL,
    "season" INTEGER,
    "seasonType" VARCHAR(255) NOT NULL,
    "total" DECIMAL(10,2),
    "overOdds" DECIMAL(10,2),
    "underOdds" DECIMAL(10,2),
    "spreadAway" DECIMAL(10,2),
    "spreadHome" DECIMAL(10,2),
    "spreadAwayOdds" DECIMAL(10,2),
    "spreadHomeOdds" DECIMAL(10,2),
    "moneylineAwayOdds" DECIMAL(10,2),
    "moneylineHomeOdds" DECIMAL(10,2),
    "gameId" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255),
    "arenaName" VARCHAR(255),
    "state" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL,
    "awayTeam" VARCHAR(255) NOT NULL,
    "homeTeam" VARCHAR(255) NOT NULL,
    "gameTime" TIMESTAMPTZ(6) NOT NULL,
    "raw" JSONB NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "awayScore" INTEGER,
    "homeScore" INTEGER,
    "currentPeriod" INTEGER,
    "periodTimeRemaining" VARCHAR(255),
    "awayPeriods" JSONB,
    "homePeriods" JSONB,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "likes" JSONB,
    "owner" INTEGER,
    "comments" JSONB,
    "bet" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports_page_feed_limits" (
    "id" SERIAL NOT NULL,
    "lastUpdated" DATE,
    "requestsMade" INTEGER,
    "requestsLimit" INTEGER,
    "published_at" TIMESTAMPTZ(6),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "reset" INTEGER,

    CONSTRAINT "sports_page_feed_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_administrator" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "username" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "resetPasswordToken" VARCHAR(255),
    "registrationToken" VARCHAR(255),
    "isActive" BOOLEAN,
    "blocked" BOOLEAN,
    "preferedLanguage" VARCHAR(255),

    CONSTRAINT "strapi_administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_permission" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "fields" JSONB,
    "conditions" JSONB,
    "role" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "properties" JSONB,

    CONSTRAINT "strapi_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strapi_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_users_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "role_id" INTEGER,

    CONSTRAINT "strapi_users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strapi_webhooks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "url" TEXT,
    "headers" JSONB,
    "events" JSONB,
    "enabled" BOOLEAN,

    CONSTRAINT "strapi_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_file" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "alternativeText" VARCHAR(255),
    "caption" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "formats" JSONB,
    "hash" VARCHAR(255) NOT NULL,
    "ext" VARCHAR(255),
    "mime" VARCHAR(255) NOT NULL,
    "size" DECIMAL(10,2) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "previewUrl" VARCHAR(255),
    "provider" VARCHAR(255) NOT NULL,
    "provider_metadata" JSONB,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upload_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_file_morph" (
    "id" SERIAL NOT NULL,
    "upload_file_id" INTEGER,
    "related_id" INTEGER,
    "related_type" TEXT,
    "field" TEXT,
    "order" INTEGER,

    CONSTRAINT "upload_file_morph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users-permissions_permission" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "controller" VARCHAR(255) NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "policy" VARCHAR(255),
    "role" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "users-permissions_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users-permissions_role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "type" VARCHAR(255),
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "users-permissions_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users-permissions_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255),
    "password" VARCHAR(255),
    "resetPasswordToken" VARCHAR(255),
    "confirmationToken" VARCHAR(255),
    "confirmed" BOOLEAN,
    "blocked" BOOLEAN,
    "role" INTEGER,
    "phone" VARCHAR(255) NOT NULL,
    "accountData" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organization" VARCHAR(255),

    CONSTRAINT "users-permissions_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "contest" INTEGER,
    "owner" INTEGER,
    "balance" DECIMAL(10,2) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_gameId_unique" ON "games"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_administrator_email_unique" ON "strapi_administrator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_role_name_unique" ON "strapi_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "strapi_role_code_unique" ON "strapi_role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users-permissions_role_type_unique" ON "users-permissions_role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "users-permissions_user_username_unique" ON "users-permissions_user"("username");

-- AddForeignKey
ALTER TABLE "contests_contestants__users_contests" ADD CONSTRAINT "contests_contestants__users_contests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users-permissions_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_components" ADD CONSTRAINT "game_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_contest_fkey" FOREIGN KEY ("contest") REFERENCES "contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
