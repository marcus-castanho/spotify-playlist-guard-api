/*
  Warnings:

  - Added the required column `ivAccessToken` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ivRefreshToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ivAccessToken" TEXT NOT NULL,
ADD COLUMN     "ivRefreshToken" TEXT NOT NULL;
