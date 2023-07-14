/*
  Warnings:

  - You are about to drop the column `followers` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the column `tracks` on the `playlists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "playlists" DROP COLUMN "followers",
DROP COLUMN "tracks";
