import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_DISCOVERY_URL } = process.env;

if (!OIDC_CLIENT_ID || !OIDC_CLIENT_SECRET || !OIDC_DISCOVERY_URL) {
  throw new Error(
    "Missing required OIDC environment variables: OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_DISCOVERY_URL",
  );
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      // Use UUID for IDs to match the existing schema convention
      generateId: "uuid",
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "oidc",
          clientId: OIDC_CLIENT_ID,
          clientSecret: OIDC_CLIENT_SECRET,
          discoveryUrl: OIDC_DISCOVERY_URL,
          scopes: ["openid", "profile", "email"],
        },
      ],
    }),
  ],
});
