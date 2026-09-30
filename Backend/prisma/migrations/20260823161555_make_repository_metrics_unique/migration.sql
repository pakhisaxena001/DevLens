/*
  Warnings:

  - A unique constraint covering the columns `[repository_id]` on the table `repository_metrics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "repository_metrics_repository_id_key" ON "repository_metrics"("repository_id");
