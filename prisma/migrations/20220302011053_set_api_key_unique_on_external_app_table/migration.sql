/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `externalApps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "externalApps_apiKey_key" ON "externalApps"("apiKey");
