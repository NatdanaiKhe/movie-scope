import { existsSync, readFileSync } from "node:fs";

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

const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;
