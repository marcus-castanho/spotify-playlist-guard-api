/*
  Warnings:

  - You are about to drop the column `ivAccessToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ivRefreshToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ivAccessToken",
DROP COLUMN "ivRefreshToken";
