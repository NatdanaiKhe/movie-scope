CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "watchlist_item" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "movie_id" INTEGER NOT NULL,
  "title" VARCHAR(255),
  "poster_path" TEXT,
  "release_date" DATE,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "watchlist_item_user_id_fkey"
    FOREIGN KEY ("user_id")
    REFERENCES "profile"("user_id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "watchlist_item_user_id_movie_id_key" ON "watchlist_item" ("user_id", "movie_id");
CREATE INDEX "watchlist_item_user_id_idx" ON "watchlist_item" ("user_id");
