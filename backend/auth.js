const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "";
const backendUrl = (
  process.env.VITE_BACKEND_API_URL || 
  process.env.BETTER_AUTH_URL || 
  process.env.RENDER_EXTERNAL_URL || 
  ""
).replace(/\/$/, "");

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user"
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", frontendUrl, `${frontendUrl}/`].filter(Boolean),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-do-not-use-in-prod",
  baseURL: backendUrl 
    ? `${backendUrl}/api/auth`
    : "http://localhost:3001/api/auth",
  advanced: {
    ipAddress: {
    ipAddressHeaders: ["x-forwarded-for"],
  },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});

module.exports = { auth };
