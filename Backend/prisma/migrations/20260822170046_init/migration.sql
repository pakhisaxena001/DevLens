-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "avatar" VARCHAR(255),
    "github_username" VARCHAR(255),
    "role" VARCHAR(50) DEFAULT 'user',
    "verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "github_id" BIGINT,
    "user_id" UUID NOT NULL,
    "owner" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "language" VARCHAR(50),
    "stars" INTEGER DEFAULT 0,
    "forks" INTEGER DEFAULT 0,
    "watchers" INTEGER DEFAULT 0,
    "open_issues" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repository_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repository_id" UUID NOT NULL,
    "contributors" INTEGER DEFAULT 0,
    "commits" INTEGER DEFAULT 0,
    "issues" INTEGER DEFAULT 0,
    "pull_requests" INTEGER DEFAULT 0,
    "last_commit_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "repository_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repository_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "health_score" INTEGER DEFAULT 0,
    "code_quality_score" INTEGER DEFAULT 0,
    "documentation_score" INTEGER DEFAULT 0,
    "test_coverage" INTEGER DEFAULT 0,
    "performance_score" INTEGER DEFAULT 0,
    "security_score" INTEGER DEFAULT 0,
    "ai_summary" TEXT,
    "recommendations" TEXT[],
    "analysis_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "repository_id" UUID NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "analysis_id" UUID,
    "repository_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "snapshot_data" JSONB,
    "health_score" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_github_username_key" ON "users"("github_username");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_github_username" ON "users"("github_username");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_github_id_key" ON "repositories"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_url_key" ON "repositories"("url");

-- CreateIndex
CREATE INDEX "idx_repositories_user_id" ON "repositories"("user_id");

-- CreateIndex
CREATE INDEX "idx_repositories_github_id" ON "repositories"("github_id");

-- CreateIndex
CREATE INDEX "idx_repository_metrics_repository_id" ON "repository_metrics"("repository_id");

-- CreateIndex
CREATE INDEX "idx_analyses_repository_id" ON "analyses"("repository_id");

-- CreateIndex
CREATE INDEX "idx_analyses_user_id" ON "analyses"("user_id");

-- CreateIndex
CREATE INDEX "idx_analyses_analysis_date" ON "analyses"("analysis_date");

-- CreateIndex
CREATE INDEX "idx_bookmarks_user_id" ON "bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "idx_bookmarks_repository_id" ON "bookmarks"("repository_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_repository_id_key" ON "bookmarks"("user_id", "repository_id");

-- CreateIndex
CREATE INDEX "idx_analysis_history_repository_id" ON "analysis_history"("repository_id");

-- CreateIndex
CREATE INDEX "idx_analysis_history_user_id" ON "analysis_history"("user_id");

-- CreateIndex
CREATE INDEX "idx_analysis_history_created_at" ON "analysis_history"("created_at");

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repository_metrics" ADD CONSTRAINT "repository_metrics_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_history" ADD CONSTRAINT "analysis_history_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_history" ADD CONSTRAINT "analysis_history_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_history" ADD CONSTRAINT "analysis_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
