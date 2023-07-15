/*
  Warnings:

  - A unique constraint covering the columns `[spotify_id]` on the table `playlists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotify_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotify_id` to the `playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotify_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "spotify_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "spotify_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "playlists_spotify_id_key" ON "playlists"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_spotify_id_key" ON "users"("spotify_id");
