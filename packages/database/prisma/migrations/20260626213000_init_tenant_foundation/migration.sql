CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'REVIEWER');
CREATE TYPE "EnvironmentType" AS ENUM ('TEST', 'LIVE');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "external_auth_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "display_name" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organisations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organisation_memberships" (
  "id" TEXT NOT NULL,
  "organisation_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" "MembershipRole" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organisation_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
  "id" TEXT NOT NULL,
  "organisation_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "environments" (
  "id" TEXT NOT NULL,
  "organisation_id" TEXT NOT NULL,
  "project_id" TEXT NOT NULL,
  "type" "EnvironmentType" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_external_auth_id_key" ON "users"("external_auth_id");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE UNIQUE INDEX "organisations_slug_key" ON "organisations"("slug");
CREATE UNIQUE INDEX "organisation_memberships_organisation_id_user_id_key" ON "organisation_memberships"("organisation_id", "user_id");
CREATE INDEX "organisation_memberships_user_id_idx" ON "organisation_memberships"("user_id");
CREATE UNIQUE INDEX "projects_organisation_id_slug_key" ON "projects"("organisation_id", "slug");
CREATE INDEX "projects_organisation_id_idx" ON "projects"("organisation_id");
CREATE UNIQUE INDEX "environments_project_id_type_key" ON "environments"("project_id", "type");
CREATE INDEX "environments_organisation_id_idx" ON "environments"("organisation_id");
CREATE INDEX "environments_organisation_id_project_id_idx" ON "environments"("organisation_id", "project_id");

ALTER TABLE "organisation_memberships" ADD CONSTRAINT "organisation_memberships_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "organisation_memberships" ADD CONSTRAINT "organisation_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "environments" ADD CONSTRAINT "environments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "environments" ADD CONSTRAINT "environments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
