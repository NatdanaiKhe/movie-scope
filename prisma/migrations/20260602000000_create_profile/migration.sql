CREATE TABLE "profile" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "display_name" VARCHAR(255) NOT NULL,
  "bio" TEXT,
  "avatar_url" TEXT,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "profile_user_id_key" ON "profile" ("user_id");
