-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_secret" BYTEA,
ADD COLUMN     "two_factor_secret_iv" BYTEA;
