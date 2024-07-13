-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "remember_me" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 day';
