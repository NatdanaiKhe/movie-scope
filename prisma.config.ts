import { existsSync, readFileSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

if (existsSync(".env")) {
  const envFile = readFileSync(".env", "utf8");

  for (const line of envFile.split("\n")) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, value] = match;
    process.env[key] ??= value.trim();
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
