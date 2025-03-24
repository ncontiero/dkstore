-- CreateTable
CREATE TABLE "recovery_codes" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "code" BYTEA NOT NULL,
    "code_iv" BYTEA NOT NULL,

    CONSTRAINT "recovery_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recovery_codes" ADD CONSTRAINT "recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
