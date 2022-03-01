-- CreateTable
CREATE TABLE "externalApps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recoverEmail" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "ivApiKey" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "externalApps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "externalApps_baseUrl_key" ON "externalApps"("baseUrl");
