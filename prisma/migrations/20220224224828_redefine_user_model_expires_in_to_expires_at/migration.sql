/*
  Warnings:

  - You are about to drop the column `expires_in` on the `users` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "expires_in",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
