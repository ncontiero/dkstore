-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 day';
