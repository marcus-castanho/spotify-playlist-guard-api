/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_in` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
DROP COLUMN "refresh_token",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "expires_in" TEXT NOT NULL,
ADD COLUMN     "followers" JSONB NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
